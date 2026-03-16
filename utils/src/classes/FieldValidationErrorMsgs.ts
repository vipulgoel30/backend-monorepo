// User imports
import type { BaseFieldValidationRule, NumberFieldValidationRule, StringFieldValidationRule } from "../types.ts";
import { ValidationErrorMsgs } from "./ValidationErrorMsgs.ts";

export class FieldValidationErrorMsg<TRequired extends boolean> {
  readonly invalidType: string;
  readonly invalidValue: string;
  readonly required?: string;

  constructor(validations: BaseFieldValidationRule<TRequired>) {
    this.invalidType = ValidationErrorMsgs.invalidType(validations.field, validations.type);
    this.invalidValue = ValidationErrorMsgs.invalidValue(validations.field);
    if (validations.isRequired) this.required = ValidationErrorMsgs.required(validations.field);
  }
}

export class StringFieldValidationErrorMsg<TRequired extends boolean> extends FieldValidationErrorMsg<TRequired> {
  readonly minLength?: string;
  readonly maxLength?: string;
  readonly noSpaces?: string;

  constructor(validations: StringFieldValidationRule<TRequired>) {
    super(validations);

    if (typeof validations.minLength === "number") this.minLength = ValidationErrorMsgs.minLength(validations.field, validations.minLength);
    if (typeof validations.maxLength === "number") this.maxLength = ValidationErrorMsgs.maxLength(validations.field, validations.maxLength);
    if (validations.isNoSpaces === true) this.noSpaces = ValidationErrorMsgs.noSpaces(validations.field);
  }
}

export class NumberFieldValidationErrorMsg<TRequired extends boolean> extends FieldValidationErrorMsg<TRequired> {
  readonly minValue?: string;
  readonly maxValue?: string;

  constructor(validations: NumberFieldValidationRule<TRequired>) {
    super(validations);
    if (typeof validations.minValue === "number") this.minValue = ValidationErrorMsgs.minValue(validations.field, validations.minValue);
    if (typeof validations.maxValue === "number") this.maxValue = ValidationErrorMsgs.maxValue(validations.field, validations.maxValue);
  }
}
