export type Primitive = string | number | boolean;

////////////////////////////////////////////////
/// FIELD VALIDATION TYPES
////////////////////////////////////////////////
export interface BaseFieldValidationRule<FieldType extends Primitive> {
  readonly field: string;
  readonly type: FieldType;
  readonly isRequired?: boolean;
}

export interface StringFieldValidationRule extends BaseFieldValidationRule<string> {
  readonly isTrim?: boolean;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly isNoSpaces?: boolean;
  readonly isToLowerCase?: boolean;
  readonly isToUpperCase?: boolean;
}

export interface NumberFieldValidationRule extends BaseFieldValidationRule<number> {
  readonly minValue?: number;
  readonly maxValue?: number;
}

export type FieldValidationRule = StringFieldValidationRule | NumberFieldValidationRule;

//////////////////////////////////////////////////////
// FIELD VALIDATION MESSAGE TYPES
//////////////////////////////////////////////////////
export interface BaseFieldValidationMessageRule {
  readonly invalidType: string;
  readonly invalidValue: string;
  readonly required?: string;
}

export interface StringFieldValidationMessageRule extends BaseFieldValidationMessageRule {
  readonly minLength?: string;
  readonly maxLength?: string;
  readonly noSpaces?: string;
}

export interface NumberFieldValidationMessageRule extends BaseFieldValidationMessageRule {
  readonly minValue?: string;
  readonly maxValue?: string;
}

export type FieldValidationMessageRule = StringFieldValidationMessageRule | NumberFieldValidationMessageRule;
