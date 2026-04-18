// User imports
import { utilsConstants as constants } from "../../config/constants.ts";
import { AppError, type DeveloperError } from "../AppError.ts";

export class BadRequestError<MetaType> extends AppError<MetaType> {
  constructor(
    message: string,
    public readonly developerError?: DeveloperError<MetaType>,
  ) {
    super(message, constants.HTTP_CODES.BAD_REQUEST, developerError);
  }
}
