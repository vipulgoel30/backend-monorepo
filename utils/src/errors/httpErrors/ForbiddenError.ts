// User imports
import { utilsConstants as constants } from "../../config/constants.ts";
import { AppError, type DeveloperError } from "../AppError.ts";

export class ForbiddenError<T> extends AppError<T> {
  constructor(
    message: string,
    public readonly developerError?: DeveloperError<T>,
  ) {
    super(message, constants.HTTP_CODES.FORBIDDEN, developerError);
  }
}
