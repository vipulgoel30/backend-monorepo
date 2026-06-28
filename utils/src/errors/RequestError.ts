// user imports
import { utilsConstants as constants } from "../config/constants.ts";
import { utilsMessages as messages } from "../config/messages.ts";
import { CustomError, TCustomErrorConstructorOptions } from "./CustomError.ts";

export interface TDeveloperError {
  message: string;
  statusCode: number;
  meta?: any;
}

export interface TRequestErrorConstructorOptions extends TCustomErrorConstructorOptions {
  developerError?: TDeveloperError;
}

export class RequestError extends CustomError {
  public readonly developerError?: TDeveloperError;
  public readonly statusCode: number;

  constructor(
    message: string,
    statusCode: number,
    options?: TRequestErrorConstructorOptions,
  ) {
    super(message, {
      meta: options?.meta,
      scope: options?.scope,
      errorObj: options?.errorObj,
    });

    this.statusCode = statusCode;
    if (options?.developerError)
      this.developerError = { ...options.developerError };

    // ensure the displayed name is RequestError instead of CustomError
    this.name = this.constructor.name;

    // set the prototype correctly so that (new RequestError() instanceOf RequestError ==> true)
    Object.setPrototypeOf(this, new.target.prototype);

    // remove the constructor call in stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  static getStatus(statusCode: number) {
    return statusCode >= constants.HTTP_CODES.BAD_REQUEST &&
      statusCode < constants.HTTP_CODES.INTERNAL_SERVER_ERROR
      ? messages.STATUS.FAIL
      : messages.STATUS.ERROR;
  }
}
