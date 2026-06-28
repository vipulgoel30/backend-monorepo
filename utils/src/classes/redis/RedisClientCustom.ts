// third party imports
import z from "zod";
import { createClient } from "redis";

// user imports
import { utilsMessages as messages } from "../../config/messages.ts";
import { type TRetryAsyncF } from "../../helpers/retryAsync.ts";
import { formatErrorMessage, formatStr } from "../../utils.ts";
import type { TRedisConnectUrlConfig, TRedisClient } from "./../../types/redis.ts";
import { NumberZodSchema, StringZodSchema, ZodHelpers } from "../Zod.ts";
import { Logger } from "./../Logger.ts";
import { utilsSettings as settings } from "../../config/settings.ts";
import { redisUrlConfigDefinition } from "../../config/definitions.ts";
import { RedisCustomError } from "./RedisErrors.ts";
import { CustomError, RedisTimeHelper } from "../../exports.ts";

const redisClientUrlZodSchema = z.object({
  username: new StringZodSchema({
    fieldDefinition: redisUrlConfigDefinition.username,
  }).build(),
  password: new StringZodSchema({
    fieldDefinition: redisUrlConfigDefinition.password,
  }).build(),
  hostname: new StringZodSchema({
    fieldDefinition: redisUrlConfigDefinition.hostname,
  }).build(),
  port: new NumberZodSchema({
    fieldDefinition: redisUrlConfigDefinition.port,
  }).build(),
});

export interface TRedisClientAndServerTime {
  client: TRedisClient;
  serverTime: Date;
}

export class RedisCustomClient {
  private readonly _connectionUrl: string;
  private _retryAsync: TRetryAsyncF;
  private _client: TRedisClient | null = null;
  private _clientInitPromise: Promise<TRedisClient> | null = null;
  private _serverTime: Date | null = null;

  constructor(options: TRedisConnectUrlConfig, retryAsyncF: TRetryAsyncF) {
    this._connectionUrl = this._createRedisConnectionUrl(options);
    this._retryAsync = retryAsyncF;
  }

  get client(): TRedisClient {
    if (this._client === null) throw new RedisCustomError(messages.REDIS.CLIENT_NOT_FOUND);
    return this._client;
  }

  clientAndServerTime(): TRedisClientAndServerTime {
    return {
      client: this.client,
      serverTime: this._serverTime!,
    };
  }

  async initClient(): Promise<this> {
    try {
      Logger.logger?.debug(messages.METHOD.LOG_IN);
      const client = await this._createRedisClient();
      const serverTime = await RedisTimeHelper.time(client);

      // assigning client and serverTime only if
      // both are available
      this._client = client;
      this._serverTime = serverTime;

      Logger.logger?.debug(messages.METHOD.LOG_OUT_SUCCESS);
      return this;
    } catch (initClientError) {
      const executionContext = messages.REDIS.INIT_CLIENT_ERROR;

      const finalError: CustomError =
        initClientError instanceof CustomError
          ? initClientError.addContext(executionContext)
          : new RedisCustomError(executionContext, { error: initClientError });

      Logger.logger?.debug(messages.METHOD.LOG_OUT_ERROR);
      throw finalError;
    }
  }

  private _createRedisConnectionUrl(options: TRedisConnectUrlConfig): string {
    try {
      Logger.logger?.debug?.(messages.METHOD.LOG_IN);

      // validating the connection paramaters
      const { error, data } = redisClientUrlZodSchema.safeParse(options);
      if (error) {
        throw new RedisCustomError(
          formatErrorMessage(messages.REDIS.INVALID_CONNECTION_PARAMETERS, ZodHelpers.parseZodError(error, true)),
        );
      }

      // formatting the connection url
      const connectionUrl: string = formatStr(settings.REDIS_URL, data);

      Logger.logger?.debug?.(messages.METHOD.LOG_OUT_SUCCESS);
      return connectionUrl;
    } catch (createRedisConnectionUrlError) {
      const executionContext = messages.REDIS.CREATE_CONNECTION_URL_ERROR;

      // configuring the error object
      const finalError: CustomError =
        createRedisConnectionUrlError instanceof CustomError
          ? createRedisConnectionUrlError.addContext(executionContext)
          : new RedisCustomError(formatErrorMessage(executionContext, createRedisConnectionUrlError), {
              error: createRedisConnectionUrlError,
            });

      Logger.logger?.debug(messages.METHOD.LOG_OUT_ERROR);
      throw finalError;
    }
  }

  private async _createRedisClient(): Promise<TRedisClient> {
    Logger.logger?.debug?.(messages.METHOD.LOG_IN);

    // checking if client already exists
    if (this._client !== null) return this._client;

    // checking if client connection is already in progress
    if (this._clientInitPromise !== null) return this._clientInitPromise;

    try {
      this._clientInitPromise = this._retryAsync(async () => {
        const client: TRedisClient = createClient({ url: this._connectionUrl });
        try {
          await new Promise<TRedisClient>((resolve, reject) => {
            client.once("ready", () => {
              // marking the client available only
              // when ready event is sent on the connection
              Logger.logger?.info(messages.REDIS.READY_EVENT);
              resolve(client);
            });

            client.once("error", (error) => {
              Logger.logger?.error(formatErrorMessage(messages.REDIS.ERROR_EVENT, error));
              reject(error);
            });

            client.connect().catch(reject);
          });

          return client;
        } catch (clientConnectError) {
          // client throws errors
          // cleaning up client object before retrying the connection
          this.#removeAllRedisClientListeners(client);
          try {
            client.destroy();
          } catch {}
          throw clientConnectError;
        }
      });

      // trying to create redis client
      const client = await this._clientInitPromise;
      this._clientInitPromise = null;

      // Client event handlers
      client.on("error", (error) => {
        Logger.logger?.error(formatErrorMessage(messages.REDIS.ERROR_EVENT, error));
      });

      client.on("reconnecting", () => {
        Logger.logger?.warn(messages.REDIS.RECONNECTING_EVENT);
      });

      client.on("end", () => {
        Logger.logger?.warn(messages.REDIS.END_EVENT);
        this.#removeAllRedisClientListeners(client);
        this._client = null;
        this._serverTime = null;
      });

      Logger.logger?.debug?.(messages.METHOD.LOG_OUT_SUCCESS);
      return client;
    } catch (createRedisClientError) {
      this._clientInitPromise = null;

      const executionContext: string = messages.REDIS.CREATE_CLIENT_ERROR;

      // configuring the error object
      const finalError: CustomError =
        createRedisClientError instanceof CustomError
          ? createRedisClientError.addContext(executionContext)
          : new RedisCustomError(formatErrorMessage(executionContext, createRedisClientError), {
              error: createRedisClientError,
            });

      Logger.logger?.error?.(messages.METHOD.LOG_OUT_ERROR);
      throw finalError;
    }
  }

  #removeAllRedisClientListeners(client: TRedisClient) {
    try {
      ["error", "reconnecting", "end", "ready", "connect"].forEach((event) => client.removeAllListeners(event));
    } catch {}
  }

  destroyClient(): boolean {
    try {
      // if client is not initialized then
      // calling destroy client is not required
      if (this._client === null) return true;

      this.#removeAllRedisClientListeners(this._client);
      this._client.destroy();
      this._client = null;
      this._serverTime = null;

      return true;
    } catch (destroyClientError) {
      // const executionContext =

      return false;
    }
  }
}
