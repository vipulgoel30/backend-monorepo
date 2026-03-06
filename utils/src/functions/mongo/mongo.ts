// Third party imports
import { z } from "zod";
import { connect, type ConnectOptions, type Mongoose } from "mongoose";

// User imports
import { type retryAsyncWrapper } from "../retryAsync.ts";
import { mongoValidation } from "../../config/validations.ts";
import { createNumberZodSchema, createStringZodSchema, parseZodError } from "../zod.ts";
import { CustomError } from "../../errors/CustomError.ts";
import { utilsSettings as settings } from "../../config/settings.ts";
import { formatStr } from "../formatStr.ts";
import { utilsMessages as messages } from "./../../config/messages.ts";
import { getErrMessage } from "../../utils.ts";

export class MongoError extends CustomError {
  constructor(message: string, meta?: CustomError['meta']) {
    super(message, messages.MONGO_ERROR.PREFIX, meta);
  }
}

const createMongoUriZodSchema = z.object({
  hostname: createStringZodSchema(mongoValidation.hostname),
  port: createNumberZodSchema(mongoValidation.port, true),
  username: createStringZodSchema(mongoValidation.username),
  password: createStringZodSchema(mongoValidation.password),
  database: createStringZodSchema(mongoValidation.database),
});

type CreateMongoUriConfig = z.infer<typeof createMongoUriZodSchema>;

export const createMongoUri = (options: CreateMongoUriConfig) => {
  try {
    const { success, data, error } = createMongoUriZodSchema.safeParse(options);
    if (!success) {
      throw new MongoError(parseZodError(error, true));
    }

    return formatStr(settings.MONGO_URI, data);
  } catch (err) {
    if (err instanceof MongoError) throw err;
    throw new MongoError(
      formatStr(messages.ERROR_FORMAT, {
        defaultMessage: messages.MONGO_ERROR.CREATE_MONGO_URI_ERROR,
        errorMsg: getErrMessage(err),
      }),
    );
  }
};

export const mongoConnect = async (uri: string, retryAsync: ReturnType<typeof retryAsyncWrapper>, options?: ConnectOptions): Promise<Mongoose> => {
  try {
    const mongoose = await retryAsync(() => connect(uri, options));
    return mongoose;
  } catch (err) {
    if (err instanceof MongoError) throw err;
    throw new MongoError(
      formatStr(messages.ERROR_FORMAT, {
        defaultMessage: messages.MONGO_ERROR.MONGO_CONNECT_ERROR,
        errorMsg: getErrMessage(err),
      }),
    );
  }
};
