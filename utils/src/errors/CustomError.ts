// User imports
import { utilsConstants as constants } from "../config/constants.ts";
import { utilsMessages as messages } from "../exports.ts";


export interface DeveloperError<MetaInfoType> {
  message?: string;
  statusCode?: number;
  meta?: MetaInfoType;
}

export class CustomError<MetaInfoType> extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly developerError?: DeveloperError<MetaInfoType>,
  ) {
    super(message);
  }

  static getStatus(statusCode: number) {
    return statusCode >= constants.HTTP_CODES.BAD_REQUEST && statusCode < constants.HTTP_CODES.INTERNAL_SERVER_ERROR
      ? messages.STATUS.FAIL
      : messages.STATUS.ERROR;
  }
}

