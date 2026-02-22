// User imports
import { utilsConstants as constants } from "../config/constants.ts";
import { utilsMessages as messages } from "../exports.ts";

export interface DeveloperError<MetaType> {
  message?: string;
  statusCode?: number;
  meta?: MetaType;
}

export class AppError<MetaType> extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly developerError?: DeveloperError<MetaType>,
  ) {
    super(message);
  }

  static getStatus(statusCode: number) {
    return statusCode >= constants.HTTP_CODES.BAD_REQUEST && statusCode < constants.HTTP_CODES.INTERNAL_SERVER_ERROR
      ? messages.STATUS.FAIL
      : messages.STATUS.ERROR;
  }
}
