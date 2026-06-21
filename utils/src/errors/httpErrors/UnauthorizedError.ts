// user imports
import { utilsConstants as constants } from "../../config/constants.ts";
import {
  RequestError,
  TRequestErrorConstructorOptions,
} from "../RequestError.ts";

export class UnauthorizedError extends RequestError {
  constructor(
    message: string,
    statusCode: number,
    options: Omit<TRequestErrorConstructorOptions, "statusCode">,
  ) {
    super(message, statusCode, {
      ...options,
      statusCode: constants.HTTP_CODES.UNAUTHORIZED,
    });

    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
