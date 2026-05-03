// Third party imports
import z from "zod";
import { createClient, type RedisClientType } from "redis";

// User imports
import { CustomError, type CustomErrorInfo } from "../errors/CustomError.ts";
import { utilsMessages as messages } from "../config/messages.ts";
import { NumberZodSchema, StringZodSchema, ZodHelpers } from "../classes/Zod.ts";
import { redisUrlConfigurationFieldDefinitions } from "../config/definitions.ts";
import { utilsSettings as settings } from "../config/settings.ts";
import { formatErrorMessage, formatStr, logger } from "../utils.ts";
import { type RetryAsyncF } from "./retryAsync.ts";
import { type RedisConnectUrlConfig } from "./../types/redis.ts";
import { TRedisClient } from "../types/redis.ts";
import { ValidationErrorMsgs } from "../exports.ts";

export class RedisError extends CustomError {
  constructor(message: string, info?: Exclude<CustomErrorInfo, "scope">) {
    super(message, { ...info, scope: messages.REDIS.SCOPE });
  }
}

export const createRedisClientUrlZodSchema = z.object({
  username: new StringZodSchema(redisUrlConfigurationFieldDefinitions.username).build(),
  password: new StringZodSchema(redisUrlConfigurationFieldDefinitions.password).build(),
  hostname: new StringZodSchema(redisUrlConfigurationFieldDefinitions.hostname).build(),
  port: new NumberZodSchema(redisUrlConfigurationFieldDefinitions.port).build(),
});

export const redisTimeCommandResponseZodSchema = z
  .array(
    z.coerce.number({
      error: (issue) => {
        if (issue.code === "invalid_type") return ValidationErrorMsgs.invalidType(formatStr(messages.REDIS.REDIS_COMMAND_RESPONSE, {
          command:
            messages.REDIS.COMMANDS_NAME.TIME
        }), "number[]");
        return ValidationErrorMsgs.invalidValue("Redis Time Command Response");
      },
    }),
).length(2, {
    error: (issue) => {
      if(issue.code ==="too_small")
    }
  });

export class RedisClientHelper {
  private readonly _connectionUrl: string;
  private readonly _retryAsync: RetryAsyncF;
  private _client: RedisClient | null = null;
  private _clientInitPromise: Promise<void> | null = null;

  get client(): RedisClient | null {
    logger?.debug?.(messages.METHOD.LOG_IN);
    if (this._client === null && this._clientInitPromise === null) {
      this._clientInitPromise = this.createRedisClient()
        .then((client) => {
          this._client = client;
        })
        .catch((_) => {
          this._client = null;
        })
        .finally(() => (this._clientInitPromise = null));
    }

    logger?.debug?.(messages.METHOD.LOG_OUT);
    return this._client;
  }

  constructor(options: RedisConnectUrlConfig, retryAsync: RetryAsyncF) {
    this._connectionUrl = this.createRedisClientUrl(options);
    this._retryAsync = retryAsync;
  }
}

export class RedisHashHelper {
  async hget(client: RedisClient, key: string, field: string): Promise<string | null> {
    logger?.debug?.(messages.METHOD.LOG_IN);
    try {
      return await client.hGet(key, field);
    } catch (error) {
      logger?.warn?.(formatErrorMessage(formatStr(messages.REDIS.REDIS_COMMAND_ERROR, { command: "hget" }), error));
      return null;
    }
  }

  // async hgetex(
  //   client: RedisClient,
  //   key: string,
  //   field: string,
  //   options: {
  //     expiry: {
  //       seconds?: number;
  //       milliseconds?: number;
  //     };
  //     persist?: boolean;
  //   },
  // ): Promise<string | null> {}
}

export class RedisStringHelper {
  async get(client: RedisClient, key: string, correlationId?: string): Promise<string | null> {
    logger?.debug?.(messages.METHOD.LOG_IN, { correlationId });
    try {
      return await client.get(key);
    } catch (error) {
      logger?.warn?.(formatErrorMessage(formatStr(messages.REDIS.REDIS_COMMAND_ERROR, { command: messages.REDIS.COMMANDS_NAME.STRING.GET }), error), { correlationId });
      return null;
    }
  }

  async getex(client: RedisClient, key: string, expiryOptions: TRedisExpiryOptions, correlationId?: string): Promise<string | null> {
    logger?.debug?.(messages.METHOD.LOG_IN, { correlationId });
    try {
    } catch (error) {}
  }
}
