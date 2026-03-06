import { boolean } from "zod";

export type Primitive = string | number | boolean | null | undefined;

////////////////////////////////////////////////
/// FIELD VALIDATION TYPES
////////////////////////////////////////////////
export interface BaseFieldValidationRule<TRequired extends boolean> {
  readonly field: string;
  readonly type: "string" | "number" | "boolean";
  readonly isRequired: TRequired;
}

export interface StringFieldValidationRule<TRequired extends boolean> extends BaseFieldValidationRule<TRequired> {
  readonly isTrim?: boolean;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly isNoSpaces?: boolean;
  readonly isToLowerCase?: boolean;
  readonly isToUpperCase?: boolean;
}

export interface NumberFieldValidationRule<TRequired extends boolean> extends BaseFieldValidationRule<TRequired> {
  readonly minValue?: number;
  readonly maxValue?: number;
}

// export type FieldValidationRule<TRequired extends boolean> = StringFieldValidationRule<TRequired> | NumberFieldValidationRule<TRequired>;

//////////////////////////////////////////////////////
// FIELD VALIDATION MESSAGE TYPES
//////////////////////////////////////////////////////
export interface BaseFieldValidationMessage {
  readonly invalidType: string;
  readonly invalidValue: string;
  readonly required?: string;
}

export interface StringFieldValidationMessage extends BaseFieldValidationMessage {
  readonly minLength?: string;
  readonly maxLength?: string;
  readonly noSpaces?: string;
}

export interface NumberFieldValidationMessage extends BaseFieldValidationMessage {
  readonly minValue?: string;
  readonly maxValue?: string;
}

// export type FieldValidationMessage = StringFieldValidationMessage | NumberFieldValidationMessage;
