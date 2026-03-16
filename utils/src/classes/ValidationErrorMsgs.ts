// User imports
import { formatStr } from "../utils.ts";
import { utilsMessages as messages } from "../exports.ts";

export class ValidationErrorMsgs {
  static invalidType(field: string, type: string): string {
    return formatStr(messages.FIELD.INVALID_TYPE, {
      field,
      type,
    });
  }

  static invalidValue(field: string): string {
    return formatStr(messages.FIELD.INVALID_VALUE, { field });
  }

  static required(field: string): string {
    return formatStr(messages.FIELD.REQUIRED, { field });
  }

  static minLength(field: string, minLength: number): string {
    return formatStr(messages.FIELD.MIN_LENGTH, { field, minLength });
  }

  static maxLength(field: string, maxLength: number): string {
    return formatStr(messages.FIELD.MAX_LENGTH, { field, maxLength });
  }

  static noSpaces(field: string): string {
    return formatStr(messages.FIELD.NO_SPACE, { field });
  }

  static minValue(field: string, minValue: number): string {
    return formatStr(messages.FIELD.MIN_VALUE, { field, minValue });
  }

  static maxValue(field: string, maxValue: number): string {
    return formatStr(messages.FIELD.MAX_VALUE, { field, maxValue });
  }
}
