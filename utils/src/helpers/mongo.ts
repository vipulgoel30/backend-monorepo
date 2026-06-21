// Third party imports
import { z } from "zod";
import { connect, type ConnectOptions, type Mongoose } from "mongoose";

// User imports
import { type retryAsyncWrapper } from "./retryAsync.ts";
import { mongoUriConfigurationFieldDefinitions } from "../config/definitions.ts";
import {
  CustomError,
  TCustomErrorConstructorOptionsWithoutScope,
} from "../errors/CustomError.ts";
import { utilsSettings as settings } from "../config/settings.ts";
import { utilsMessages as messages } from "../config/messages.ts";
import {
  NumberZodSchema,
  StringZodSchema,
  ZodHelpers,
} from "../classes/Zod.ts";
import { formatStr } from "../utils.ts";

export class MongoCustomError extends CustomError {
  constructor(
    message: string,
    options?: TCustomErrorConstructorOptionsWithoutScope,
  ) {
    super(message, {
      ...options,
      info: { ...options?.info, scope: messages.MONGO.SCOPE },
    });
  }
}

export interface CreateMongoUriConfig {
  hostname: string;
  port: string;
  username: string;
  password: string;
  database: string;
}

const createMongoUriZodSchema = z.object({
  hostname: new StringZodSchema(
    mongoUriConfigurationFieldDefinitions.hostname,
  ).build(),
  port: new NumberZodSchema(mongoUriConfigurationFieldDefinitions.port).build(),
  username: new StringZodSchema(
    mongoUriConfigurationFieldDefinitions.username,
  ).build(),
  password: new StringZodSchema(
    mongoUriConfigurationFieldDefinitions.password,
  ).build(),
  database: new StringZodSchema(
    mongoUriConfigurationFieldDefinitions.database,
  ).build(),
});

export const createMongoUri = (options: CreateMongoUriConfig) => {
  try {
    const result = createMongoUriZodSchema.safeParse(options);
    if (!result.success) {
      throw new Error(ZodHelpers.parseZodError(result.error, true));
    }

    return formatStr(settings.MONGO_URI, result.data);
  } catch (error) {
    throw new MongoCustomError(messages.MONGO.CREATE_MONGO_URI_ERROR, {
      info: {
        error: error,
      },
    });
  }
};

export const mongoConnect = async (
  uri: string,
  retryAsync: ReturnType<typeof retryAsyncWrapper>,
  options?: ConnectOptions,
): Promise<Mongoose> => {
  try {
    const mongoose = await retryAsync(() =>
      connect(uri, { ...options, authSource: "admin" }),
    );
    return mongoose;
  } catch (error) {
    throw new MongoCustomError(messages.MONGO.MONGO_CONNECT_ERROR, {
      info: { error },
    });
  }
};
