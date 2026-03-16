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
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly isNoSpaces?: boolean;
}

export interface NumberFieldValidationRule<TRequired extends boolean> extends BaseFieldValidationRule<TRequired> {
  readonly minValue?: number;
  readonly maxValue?: number;
}

export interface StringFieldTransformations {
  readonly isTrim?: boolean;
  readonly isToLowerCase?: boolean;
  readonly isToUpperCase?: boolean;
}

// export type FieldValidationRule<TRequired extends boolean> = StringFieldValidationRule<TRequired> | NumberFieldValidationRule<TRequired>;
