// Third party imports
import { z, ZodNumber, ZodString, ZodType, ZodOptional, ZodNullable, ZodError, ZodCoercedNumber } from "zod";

// User imports
import { StringFieldValidationRule, StringFieldValidationMessage, NumberFieldValidationRule, NumberFieldValidationMessage } from "../types.ts";
import { InternalServerError } from "../errors/httpErrors/InternalServerError.ts";
import { formatStr } from "./formatStr.ts";
import { utilsMessages as messages } from "../config/messages.ts";
import { createNumberFieldValidationErrorMsg, createStringFieldValidationErrorMsg } from "./createFieldValidationErrorMsgs.ts";

export type ZodNullish<T extends ZodType> = ZodOptional<ZodNullable<T>>;

export const createStringZodSchema = <TRequired extends boolean>(
  validations: StringFieldValidationRule<TRequired>,
  validationsMessages?: StringFieldValidationMessage,
): TRequired extends true ? ZodString : ZodNullish<ZodString> => {
  //1. Config validations
  //1.1 Checking if both lowercase and uppercase tranformation is specified
  if (validations.isToLowerCase && validations.isToUpperCase) {
    throw new InternalServerError(formatStr(messages.INVALID_VALIDATION.CONFLICTING_CASE_TRANSFORM, { field: validations.field }), {
      meta: {
        validations,
      },
    });
  }

  //1.2 Checking if minLength > maxLength
  if (typeof validations.minLength === "number" && typeof validations.maxLength === "number" && validations.minLength > validations.maxLength) {
    throw new InternalServerError(formatStr(messages.INVALID_VALIDATION.LENGTH_RANGE, { field: validations.field }), {
      meta: validations,
    });
  }

  // If validation messages is not provided
  // creating the messages using validations
  if (!validationsMessages) validationsMessages = createStringFieldValidationErrorMsg(validations);

  //2. Initializing schema
  let schema: ZodString = z.string({
    error: (issue) => {
      if ((issue.input === undefined || issue.input === null) && validations.isRequired === true) return validationsMessages.required;
      if (issue.code === "invalid_type") return validationsMessages.invalidType;
      return validationsMessages.invalidValue;
    },
  });

  //4. No whitespace validation
  if (validations.isNoSpaces === true) schema = schema.regex(/^\S*$/, validationsMessages.noSpaces);

  //3. Trim validation
  if (validations.isTrim === true) schema = schema.trim();

  //5. ToLowerCase Validation
  if (validations.isToLowerCase === true) schema = schema.toLowerCase();

  //6. ToUpperCase Validation
  if (validations.isToUpperCase === true) schema = schema.toUpperCase();

  //7. minLength validation
  if (typeof validations.minLength === "number") {
    if (validations.minLength < 0)
      throw new InternalServerError(formatStr(messages.INVALID_VALIDATION.MIN_LENGTH, { field: validations.field }), {
        meta: validations,
      });

    schema = schema.min(validations.minLength, validationsMessages.minLength);
  }

  //8. maxLength validation
  if (typeof validations.maxLength === "number") {
    if (validations.maxLength < 0)
      throw new InternalServerError(formatStr(messages.INVALID_VALIDATION.MAX_LENGTH, { field: validations.field }), {
        meta: validations,
      });

    schema = schema.max(validations.maxLength, validationsMessages.maxLength);
  }

  return (validations.isRequired === true ? schema : schema.nullish()) as TRequired extends true ? ZodString : ZodNullish<ZodString>;
};;

export const createNumberZodSchema = <TRequired extends boolean>(
  validations: NumberFieldValidationRule<TRequired>,
  isCoerce: boolean = false,
  validationsMessages?: NumberFieldValidationMessage,
): TRequired extends true ? ZodCoercedNumber : ZodNullish<ZodCoercedNumber> => {
  //-- Config Check
  if (typeof validations.minValue === "number" && typeof validations.maxValue === "number" && validations.minValue > validations.maxValue) {
    throw new InternalServerError(formatStr(messages.INVALID_VALIDATION.MIN_MAX_VALUE_RANGE, { field: validations.field }), {
      meta: validations,
    });
  }

  // If validation messages is not provided
  // creating the messages using validations
  if (!validationsMessages) validationsMessages = createNumberFieldValidationErrorMsg(validations);

  const errorHandler: z.core.$ZodErrorMap = (issue) => {
    if ((issue.input === null || issue.input === undefined) && validations.isRequired) return validationsMessages.required;
    if (issue.code === "invalid_type") return validationsMessages.invalidType;
    return validationsMessages.invalidValue;
  };

  let schema: ZodNumber = isCoerce ? z.coerce.number({ error: errorHandler }) : z.number({ error: errorHandler });

  if (typeof validations.minValue === "number") schema = schema.min(validations.minValue, validationsMessages.minValue);
  if (typeof validations.maxValue === "number") schema = schema.max(validations.maxValue, validationsMessages.maxValue);

  return (validations.isRequired === true ? schema : schema.nullish()) as TRequired extends true ? ZodCoercedNumber : ZodNullish<ZodCoercedNumber>;
};;

export function parseZodError(error: ZodError): string[];
export function parseZodError(error: ZodError, isJoin: boolean): string;
export function parseZodError(error: ZodError, isJoin?: boolean): string[] | string {
  const errors = error.issues.map((issue) => issue.message);
  if (isJoin) return errors.join("\n");
  return errors;
};
