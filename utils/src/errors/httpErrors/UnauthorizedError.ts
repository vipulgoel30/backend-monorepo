// user imports
import { utilsConstants as constants } from "../../config/constants.ts";
import {
  RequestError,
  TRequestErrorConstructorOptions,
} from "../RequestError.ts";

export class UnauthorizedError extends RequestError {
  constructor(message: string, options?: TRequestErrorConstructorOptions) {
    super(message, constants.HTTP_CODES.UNAUTHORIZED, options);

    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
