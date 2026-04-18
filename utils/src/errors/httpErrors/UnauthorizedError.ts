// User imports
import { utilsConstants as constants } from "../../config/constants.ts";
import { AppError, type DeveloperError } from "../AppError.ts";

export class UnauthorizedError<MetaType> extends AppError<MetaType> {
  constructor(
    message: string,
    public readonly developerError?: DeveloperError<MetaType>,
  ) {
    super(message, constants.HTTP_CODES.INTERNAL_SERVER_ERROR, developerError);
  }
}
