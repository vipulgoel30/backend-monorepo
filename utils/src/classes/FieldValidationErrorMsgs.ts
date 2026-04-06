// User imports
import { FieldValidationErrorMsg, NumberFieldValidationErrorMsg, StringFieldValidationErrorMsg } from "../types.ts";
import { FieldDefinition, NumberFieldDefinition, StringFieldDefinition } from "./FieldDefinition.ts";
import { FieldTransformations } from "./FieldTransformations.ts";
import { FieldValidations } from "./FieldValidations.ts";
import { ValidationErrorMsgs } from "./ValidationErrorMsgs.ts";

export const createBaseFieldValidationErrorMsg = <TValidations extends FieldValidations, TTransformations extends FieldTransformations>(
  fieldDefinition: FieldDefinition<TValidations, TTransformations>,
  defaultMessages?: FieldValidationErrorMsg,
): FieldValidationErrorMsg => {
  return {
    invalidValue: ValidationErrorMsgs.invalidValue(fieldDefinition.validations.field, defaultMessages?.invalidValue),
    invalidType: ValidationErrorMsgs.invalidType(fieldDefinition.validations.field, fieldDefinition.validations.type, defaultMessages?.invalidType),
    ...(fieldDefinition.validations.isRequired === true && { required: ValidationErrorMsgs.required(fieldDefinition.validations.field, defaultMessages?.required) }),
  };
};

export const createStringFieldValidationErrorMsg = <TFieldDefinition extends StringFieldDefinition<any, any>>(
  fieldDefinition: TFieldDefinition,
  defaultMessages?: StringFieldValidationErrorMsg,
): StringFieldValidationErrorMsg => {
  return {
    ...createBaseFieldValidationErrorMsg(fieldDefinition, defaultMessages),
    ...(typeof fieldDefinition.validations.minLength === "number" && {
      minLength: ValidationErrorMsgs.minLength(fieldDefinition.validations.field, fieldDefinition.validations.minLength, defaultMessages?.minLength),
    }),
    ...(typeof fieldDefinition.validations.maxLength === "number" && {
      maxLength: ValidationErrorMsgs.maxLength(fieldDefinition.validations.field, fieldDefinition.validations.maxLength, defaultMessages?.maxLength),
    }),
    ...(fieldDefinition.validations.isNoSpaces === true && { noSpaces: ValidationErrorMsgs.noSpaces(fieldDefinition.validations.field, defaultMessages?.noSpaces) }),
    ...(fieldDefinition.validations.isEmail === true && { invalidEmail: ValidationErrorMsgs.invalidEmail(fieldDefinition.validations.field, defaultMessages?.invalidEmail) }),
  };
};

export const createNumberFieldValidationErrorMsg = <TFieldDefinition extends NumberFieldDefinition<any, any>>(
  fieldDefinition: TFieldDefinition,
  defaultMessages?: NumberFieldValidationErrorMsg,
): NumberFieldValidationErrorMsg => {
  return {
    ...createBaseFieldValidationErrorMsg(fieldDefinition, defaultMessages),
    ...(typeof fieldDefinition.validations.minValue === "number" && {
      minValue: ValidationErrorMsgs.minValue(fieldDefinition.validations.field, fieldDefinition.validations.minValue, defaultMessages?.minValue),
    }),
    ...(typeof fieldDefinition.validations.maxValue === "number" && {
      maxValue: ValidationErrorMsgs.maxValue(fieldDefinition.validations.field, fieldDefinition.validations.maxValue, defaultMessages?.maxValue),
    }),
  };
};
