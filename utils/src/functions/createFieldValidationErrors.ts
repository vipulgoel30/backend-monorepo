// User imports
import type {
  BaseFieldValidationMessageRule,
  BaseFieldValidationRule,
  NumberFieldValidationMessageRule,
  NumberFieldValidationRule,
  Primitive,
  StringFieldValidationMessageRule,
  StringFieldValidationRule,
} from "../types.ts";
import { formatStr } from "./formatStr.ts";
import { utilsMessages as messages } from "../config/messages.ts";

const createFieldValidationErrorMsg = <FieldType extends Primitive>(
  validations: BaseFieldValidationRule<FieldType>,
): BaseFieldValidationMessageRule => {
  return {
    invalidType: formatStr(messages.FIELD.INVALID_TYPE, {
      field: validations.field,
      type: validations.type,
    }),
    invalidValue: formatStr(messages.FIELD.INVALID_VALUE, { field: validations.field }),
    ...(validations.isRequired === true && {
      required: formatStr(messages.FIELD.REQUIRED, { field: validations.field }),
    }),
  };
};

const createStringFieldValidationErrorMsg = (
  validations: StringFieldValidationRule,
): StringFieldValidationMessageRule => {
  return {
    ...createFieldValidationErrorMsg<string>(validations),
    ...(typeof validations.minLength === "number" && {
      minLength: formatStr(messages.FIELD.MIN_LENGTH, { field: validations.field, minLength: validations.minLength }),
    }),
    ...(typeof validations.maxLength === "number" && {
      maxLength: formatStr(messages.FIELD.MAX_LENGTH, { field: validations.field, maxLength: validations.maxLength }),
    }),
    ...(validations.isNoSpaces === true && {
      prohibitSpace: formatStr(messages.FIELD.NO_SPACE, { field: validations.field }),
    }),
  };
};

const createNumberFieldValidationErrorMsg = (
  validations: NumberFieldValidationRule,
): NumberFieldValidationMessageRule => {
  return {
    ...createFieldValidationErrorMsg<number>(validations),
    ...(typeof validations.minValue === "number" && {
      minValue: formatStr(messages.FIELD.MIN_VALUE, { field: validations.field, minValue: validations.minValue }),
    }),
    ...(typeof validations.maxValue === "number" && {
      maxValue: formatStr(messages.FIELD.MAX_VALUE, { field: validations.field, maxValue: validations.maxValue }),
    }),
  };
};

export { createStringFieldValidationErrorMsg, createNumberFieldValidationErrorMsg };
