// User imports
import { utilsConstants as constants } from "../../config/constants.ts";
import { AppError, type DeveloperError } from "../AppError.ts";

class InternalServerError<T> extends AppError<T> {
  constructor(
    message: string,
    public readonly developerError?: DeveloperError<T>,
  ) {
    super(message, constants.HTTP_CODES.INTERNAL_SERVER_ERROR, developerError);
  }
}

export { InternalServerError };
