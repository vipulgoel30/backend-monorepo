// User imports
import { CustomError, DeveloperError } from "../CustomError.ts";
import { utilsConstants as constants } from "../../config/constants.ts";

class InternalServerError<T> extends CustomError<T> {
  constructor(
    message: string,
    public readonly developerError?: DeveloperError<T>,
  ) {
    super(message, constants.HTTP_CODES.INTERNAL_SERVER_ERROR, developerError);
  }
}

export { InternalServerError };
