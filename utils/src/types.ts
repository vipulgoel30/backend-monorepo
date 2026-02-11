////////////////////////////////////////////////
/// FIELD VALIDATION TYPES
////////////////////////////////////////////////
export interface BaseFieldValidationType {
  readonly field: string;
  readonly type: "string" | "number" | "boolean";
  readonly isRequired?: boolean;
}

export interface StringFieldValidationType extends BaseFieldValidationType {
  readonly isTrim?: boolean;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly isNoSpaces?: boolean;
}

export interface NumberFieldValidationType extends BaseFieldValidationType {
  readonly minValue?: number;
  readonly maxValue?: number;
}

export type FieldValidationType = StringFieldValidationType | NumberFieldValidationType;

//////////////////////////////////////////////////////
// FIELD VALIDATION MESSAGE TYPES
//////////////////////////////////////////////////////
export interface BaseFieldValidationMessageType {
  readonly invalidType: string;
  readonly required?: string;
}

export interface StringFieldValidationMessageType extends BaseFieldValidationMessageType {
  readonly minLength?: string;
  readonly maxLength?: string;
  readonly noSpaces?: string;
}

export interface NumberFieldValidationMessageType extends BaseFieldValidationMessageType {
  readonly minValue?: string;
  readonly maxValue?: string;
}

export type FieldValidationMessageType = StringFieldValidationMessageType | NumberFieldValidationMessageType;
