// user imports
import { utilsConstants as constants } from "../../config/constants.ts";
import {
  RequestError,
  TRequestErrorConstructorOptions,
} from "../RequestError.ts";

export class ForbiddenError extends RequestError {
  constructor(message: string, options?: TRequestErrorConstructorOptions) {
    super(message, constants.HTTP_CODES.FORBIDDEN, options);

    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
