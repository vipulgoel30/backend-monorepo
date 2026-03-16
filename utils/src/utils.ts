// Third party imports
import { ZodCoercedNumber } from "zod";

// User imports
import { CustomError } from "./errors/CustomError.ts";
import { utilValidations as validations } from "./config/validations.ts";
import { utilsMessages as messages } from "./config/messages.ts";
import { NumberZodSchema, ZodHelpers } from "./classes/Zod.ts";
import { NumberFieldValidationRule, Primitive } from "./types.ts";

export function isPortAsStr(port: string, schema: ZodCoercedNumber): number;
export function isPortAsStr(port: string, field: string): number;
export function isPortAsStr(port: string, arg1: string | ZodCoercedNumber): number {
  let schema: ZodCoercedNumber;
  if (typeof arg1 === "string") {
    const portValidation: NumberFieldValidationRule<true> = {
      field: arg1,
      isRequired: true,
      type: validations.portValidation.type,
      minValue: validations.portValidation.minValue,
      maxValue: validations.portValidation.maxValue,
    };
    schema = new NumberZodSchema(portValidation).isCoerce().build();
  } else {
    schema = arg1;
  }

  const result = schema.safeParse(port);

  if (!result.success) {
    throw new CustomError(ZodHelpers.parseZodError(result.error, true));
  }

  return result.data!;
}

export const formatStr = (message: string, placeholder: Record<string, Primitive>): string => {
  return message.replace(new RegExp(/\{(\w+)\}/, "g"), (_, key) => {
    if (!(key in placeholder)) {
      throw new Error(`${messages.FORMAT_STR_PLACEHOLDER_ERROR}${key}`);
    }

    return String(placeholder[key]);
  });
};

export const getErrMessage = (err: any): string => {
  return err instanceof Error ? err.message : String(err);
};

export const formatErrMessage = (defaultMessage: string, err: any): string => {
  return formatStr(messages.ERROR_FORMAT, { defaultMessage, errorMsg: getErrMessage(err) });
};
