// third party imports
import { ZodCoercedNumber } from "zod";

// user imports
import { CustomError } from "./errors/CustomError.ts";
import { utilsMessages as messages } from "./config/messages.ts";
import { NumberZodSchema, ZodHelpers } from "./classes/Zod.ts";
import { Primitive } from "./types/types.ts";
import { utilFieldTransformations, utilFieldValidations } from "./config/definitions.ts";
import { NumberFieldDefinition } from "./classes/fieldDefinition/FieldDefinition.ts";
import { Logger } from "./classes/Logger.ts";

export function isPortAsStr(port: string, schema: ZodCoercedNumber): number;
export function isPortAsStr(port: string, field: string): number;
export function isPortAsStr(port: string, schemaOrField: string | ZodCoercedNumber): number {
  try {
    Logger.logger?.debug(messages.METHOD.LOG_IN);

    // configuring the zod schema for validation
    let schema: ZodCoercedNumber;
    if (typeof schemaOrField === "string") {
      const portFieldDefintion = new NumberFieldDefinition({
        validations: utilFieldValidations.port.setField(schemaOrField).setIsRequired(true),
        transformations: utilFieldTransformations.port,
      });
      schema = new NumberZodSchema({
        fieldDefinition: portFieldDefintion,
      }).build();
    } else {
      schema = schemaOrField;
    }

    // validating the input for port validation
    const { error, data } = schema.safeParse(port);
    if (error) {
      throw new CustomError(ZodHelpers.parseZodError(error, true), { error });
    }

    Logger.logger?.debug(messages.METHOD.LOG_OUT_SUCCESS);
    return data;
  } catch (error) {
    Logger.logger?.debug(messages.METHOD.LOG_OUT_ERROR);
    throw error;
  }
}

export const formatStr = (message: string, placeholder: Record<string, Primitive>): string => {
  try {
    Logger.logger?.debug(messages.METHOD.LOG_IN);

    const formattedStr: string = message.replace(new RegExp(/\{(\w+)\}/, "g"), (_, key) => {
      if (!(key in placeholder)) {
        throw new CustomError(`${messages.FORMAT_STR_PLACEHOLDER_ERROR}${key}`);
      }

      return String(placeholder[key]);
    });

    Logger.logger?.debug(messages.METHOD.LOG_OUT_SUCCESS);
    return formattedStr;
  } catch (error) {
    Logger.logger?.debug(messages.METHOD.LOG_OUT_ERROR);
    throw error;
  }
};

export const getErrorMessage = (error: any): string => {
  try {
    Logger.logger?.debug(messages.METHOD.LOG_IN);
    const errorMessage: string = error instanceof Error ? error?.message : String(error);

    Logger.logger?.debug(messages.METHOD.LOG_OUT_SUCCESS);
    return errorMessage;
  } catch (error) {
    Logger.logger?.debug(messages.METHOD.LOG_OUT_ERROR);
    throw error;
  }
};

export const formatErrorMessage = (defaultMessage: string, error: any): string => {
  try {
    Logger.logger?.debug(messages.METHOD.LOG_IN);

    const formattedErrorMessage: string = formatStr(messages.ERROR_FORMAT, {
      defaultMessage,
      errorMsg: getErrorMessage(error),
    });

    Logger.logger?.debug(messages.METHOD.LOG_OUT_SUCCESS);
    return formattedErrorMessage;
  } catch (error) {
    Logger.logger?.debug(messages.METHOD.LOG_OUT_ERROR);
    throw error;
  }
};
