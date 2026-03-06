// Third party imports
import { ZodCoercedNumber } from "zod";

// User imports
import { CustomError } from "./errors/CustomError.ts";
import { utilValidations as validations } from "./config/validations.ts";
import { createNumberZodSchema, NumberFieldValidationRule, parseZodError } from "./exports.ts";

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
    schema = createNumberZodSchema(portValidation, true);
  } else {
    schema = arg1;
  }

  const result = schema.safeParse(port);

  if (!result.success) {
    throw new CustomError(parseZodError(result.error, true));
  }

  return result.data!;
}

export const getErrMessage = (err: unknown): string => {
  return err instanceof Error ? err.message : String(err);
};

