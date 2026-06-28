// user imports
import { CustomError, type TCustomErrorConstructorOptions } from "../../errors/CustomError.ts";
import { utilsMessages as messages } from "../../config/messages.ts";
import { InternalServerError } from "../../errors/httpErrors/InternalServerError.ts";

export class RedisCustomError extends CustomError {
  constructor(message: string, options?: Omit<TCustomErrorConstructorOptions, "scope">) {
    super(message, {
      ...options,
      scope: messages.REDIS.SCOPE,
    });
  }
}

export class RedisInternalServerError extends InternalServerError {
  constructor(message: string, options?: Omit<TCustomErrorConstructorOptions, "scope">) {
    super(message, {
      ...options,
      scope: messages.REDIS.SCOPE,
    });
  }
}
