// Third party imports
import { z, ZodNumber, ZodString, ZodType, ZodOptional, ZodNullable } from "zod";

// User imports
import {
  StringFieldValidationRule,
  StringFieldValidationMessageRule,
  NumberFieldValidationRule,
  NumberFieldValidationMessageRule,
} from "../types.ts";
import { InternalServerError } from "../errors/httpErrors/InternalServerError.ts";
import { formatStr } from "./formatStr.ts";
import { utilsMessages as messages } from "../config/messages.ts";

export type ZodNullish<T extends ZodType> = ZodOptional<ZodNullable<T>>;

export const createStringZodSchema = (
  validations: StringFieldValidationRule,
  validationsMessages: StringFieldValidationMessageRule,
): ZodString | ZodNullish<ZodString> => {
  //1. Config validations
  //1.1 Checking if both lowercase and uppercase tranformation is specified
  if (validations.isToLowerCase && validations.isToUpperCase) {
    throw new InternalServerError(formatStr(messages.CONFLICTING_CASE_TRANSFORM, { field: validations.field }), {
      meta: {
        validations,
      },
    });
  }

  //1.2 Checking if minLength > maxLength
  if (
    typeof validations.minLength === "number" &&
    typeof validations.maxLength === "number" &&
    validations.minLength > validations.maxLength
  ) {
    throw new InternalServerError(formatStr(messages.INVALID_LENGTH_RANGE_VALIDATION, { field: validations.field }), {
      meta: validations,
    });
  }

  //2. Initializing schema
  let schema: ZodString = z.string({
    error: (issue) => {
      if ((issue.input === undefined || issue.input === null) && validations.isRequired === true)
        return validationsMessages.required;
      if (issue.code === "invalid_type") return validationsMessages.invalidType;
      return validationsMessages.invalidValue;
    },
  });

  //3. Trim validation
  if (validations.isTrim === true) schema = schema.trim();

  //4. No whitespace validation
  if (validations.isNoSpaces === true) schema = schema.regex(/^\S*$/, validationsMessages.noSpaces);

  //5. ToLowerCase Validation
  if (validations.isToLowerCase === true) schema = schema.toLowerCase();

  //6. ToUpperCase Validation
  if (validations.isToUpperCase === true) schema = schema.toUpperCase();

  //7. minLength validation
  if (typeof validations.minLength === "number") {
    if (validations.minLength < 0)
      throw new InternalServerError(formatStr(messages.INVALID_MIN_LENGTH_VALIDATION, { field: validations.field }), {
        meta: validations,
      });

    schema = schema.min(validations.minLength, validationsMessages.minLength);
  }

  //8. maxLength validation
  if (typeof validations.maxLength === "number") {
    if (validations.maxLength < 0)
      throw new InternalServerError(formatStr(messages.INVALID_MAX_LENGTH_VALIDATION, { field: validations.field }), {
        meta: validations,
      });

    schema = schema.max(validations.maxLength, validationsMessages.maxLength);
  }

  return validations.isRequired === true ? schema : schema.nullish();
};

export const createNumberZodSchema = (
  validations: NumberFieldValidationRule,
  validationsMessages: NumberFieldValidationMessageRule,
): ZodNumber | ZodNullish<ZodNumber> => {
  //-- Config Check
  if (
    typeof validations.minValue === "number" &&
    typeof validations.maxValue === "number" &&
    validations.minValue > validations.maxValue
  ) {
    throw new InternalServerError(formatStr(messages.INVALID_VALUE_RANGE_VALIDATION, { field: validations.field }), {
      meta: validations,
    });
  }

  let schema: ZodNumber = z.number({
    error: (issue) => {
      if ((issue.input === null || issue.input === undefined) && validations.isRequired)
        return validationsMessages.required;
      if (issue.code === "invalid_type") return validationsMessages.invalidType;
      return validationsMessages.invalidValue;
    },
  });

  if (typeof validations.minValue === "number") schema = schema.min(validations.minValue, validationsMessages.minValue);
  if (typeof validations.maxValue === "number") schema = schema.max(validations.maxValue, validationsMessages.maxValue);

  return validations.isRequired === true ? schema : schema.nullish();
};