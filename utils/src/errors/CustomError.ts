// User imports
import { constants } from "../config/constants.ts";
import { messages } from "../exports.ts";

const { HTTP_CODES } = constants;

interface DeveloperError<T> {
  message: string;
  statusCode?: number;
  meta: T;
}

class CustomError<T> extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly developerError?: DeveloperError<T>,
  ) {
    super(message);
  }

  static getStatus(statusCode: number) {
    return statusCode >= HTTP_CODES.BAD_REQUEST && statusCode < HTTP_CODES.INTERNAL_SERVER_ERROR
      ? messages.STATUS.FAIL
      : messages.STATUS.ERROR;
  }
}

export { CustomError };
export { type DeveloperError };
