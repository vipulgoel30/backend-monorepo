// third party imports
import { ZodCoercedNumber } from "zod";

// user imports
import { CustomError } from "./errors/CustomError.ts";
import { utilsMessages as messages } from "./config/messages.ts";
import { NumberZodSchema, ZodHelpers } from "./classes/Zod.ts";
import { Primitive } from "./types/types.ts";
import {
  utilFieldTransformations,
  utilFieldValidations,
} from "./config/definitions.ts";
import { NumberFieldDefinition } from "./classes/fieldDefinition/FieldDefinition.ts";
import { Logger } from "./classes/Logger.ts";

export function isPortAsStr(port: string, schema: ZodCoercedNumber): number;
export function isPortAsStr(port: string, field: string): number;
export function isPortAsStr(
  port: string,
  schemaOrField: string | ZodCoercedNumber,
): number {
  try {
    Logger.logger?.debug(messages.METHOD.LOG_IN);
    let schema: ZodCoercedNumber;
    if (typeof schemaOrField === "string") {
      const portFieldDefintion = new NumberFieldDefinition({
        validations: utilFieldValidations.port
          .setField(schemaOrField)
          .setIsRequired(true),
        transformations: utilFieldTransformations.port,
      });
      schema = new NumberZodSchema({
        fieldDefinition: portFieldDefintion,
      }).build();
    } else {
      schema = schemaOrField;
    }

    const result = schema.safeParse(port);

    if (!result.success) {
      throw new CustomError(ZodHelpers.parseZodError(result.error, true));
    }

    return result.data!;
  } finally {
    Logger.logger?.debug(messages.METHOD.LOG_OUT);
  }
}

export const formatStr = (
  message: string,
  placeholder: Record<string, Primitive>,
): string => {
  try {
    Logger.logger?.debug(messages.METHOD.LOG_IN);
    return message.replace(new RegExp(/\{(\w+)\}/, "g"), (_, key) => {
      if (!(key in placeholder)) {
        throw new Error(`${messages.FORMAT_STR_PLACEHOLDER_ERROR}${key}`);
      }

      return String(placeholder[key]);
    });
  } finally {
    Logger.logger?.debug(messages.METHOD.LOG_OUT);
  }
};

export const getErrorMessage = (error: any): string => {
  try {
    Logger.logger?.debug(messages.METHOD.LOG_IN);
    return error instanceof Error ? error?.message : String(error);
  } finally {
    Logger.logger?.debug(messages.METHOD.LOG_OUT);
  }
};

export const formatErrorMessage = (
  defaultMessage: string,
  error: any,
): string => {
  try {
    Logger.logger?.debug(messages.METHOD.LOG_IN);
    return formatStr(messages.ERROR_FORMAT, {
      defaultMessage,
      errorMsg: getErrorMessage(error),
    });
  } finally {
    Logger.logger?.debug(messages.METHOD.LOG_OUT);
  }
};
