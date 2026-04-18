export type Primitive = string | number | boolean | null | undefined | bigint | symbol;

export enum FieldTypes {
  string = "string",
  number = "number",
}

export type ExtractClassFields<T> = Pick<
  T,
  {
    // Adds entry if key is property type : (Key : Key) or if field is function type : (Key : never)
    [Key in keyof T]: T[Key] extends Function ? never : Key;
  }[keyof T]
>;

////////////////////////////////////////////////
/// FIELD VALIDATION MESSAGES
////////////////////////////////////////////////
export interface FieldValidationErrorMsg {
  invalidValue: string;
  invalidType: string;
  required?: string;
}

export interface StringFieldValidationErrorMsg extends FieldValidationErrorMsg {
  minLength?: string;
  maxLength?: string;
  noSpaces?: string;
  invalidEmail?: string;
}

export interface NumberFieldValidationErrorMsg extends FieldValidationErrorMsg {
  minValue?: string;
  maxValue?: string;
}

export type Logger = Record<string, (message: string, ...meta: any[]) => void>;
