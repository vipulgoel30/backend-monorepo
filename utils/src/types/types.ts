// User imports
import {
  TGArrayFieldDefinition,
  TGFieldDefinition,
  TGNumberFieldDefintion,
  TGStringFieldDefinition,
} from "../classes/fieldDefinition/FieldDefinition.ts";

export type Primitive =
  | string
  | number
  | boolean
  | null
  | undefined
  | bigint
  | symbol;

export enum FieldTypes {
  string = "string",
  number = "number",
  array = "array",
}

export type TFElementTypeByFieldDefinition<
  TPFieldDefinition extends TGFieldDefinition,
> = TPFieldDefinition extends TGStringFieldDefinition
  ? string
  : TPFieldDefinition extends TGNumberFieldDefintion
    ? number
    : TPFieldDefinition extends TGArrayFieldDefinition
      ? TFElementTypeByFieldDefinition<
          TPFieldDefinition["elementsFieldDefinition"]
        >[]
      : any;

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
export interface TFieldValidationErrors {
  invalidValue: string;
  invalidType: string;
  required?: string;
}

export interface TStringFieldValidationErrors extends TFieldValidationErrors {
  minLength?: string;
  maxLength?: string;
  noSpaces?: string;
  invalidEmail?: string;
}

export interface TNumberFieldValidationErrors extends TFieldValidationErrors {
  minValue?: string;
  maxValue?: string;
}

export interface TArrayFieldValidationErrors extends TFieldValidationErrors {
  invalidLength?: string;
  minLength?: string;
  maxLength?: string;
}

export type TFValidationErrorsByFieldDefinition<
  TPFieldDefinition extends TGFieldDefinition,
> = TPFieldDefinition extends TGStringFieldDefinition
  ? TStringFieldValidationErrors
  : TPFieldDefinition extends TGNumberFieldDefintion
    ? TNumberFieldValidationErrors
    : TPFieldDefinition extends TGArrayFieldDefinition
      ? TArrayFieldValidationErrors
      : TFieldValidationErrors;

////////////////////////////////////////////////
/// CUSTOM ERROR
////////////////////////////////////////////////

////////////////////////////////////////////////
/// HELPER FUNCTIONS
////////////////////////////////////////////////
export type OnlyRequired<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

export type OnlyOptional<T> = {
  [K in keyof T as undefined extends T[K] ? K : never]: T[K];
};

export type OnlyWithTypeParameter<T, Type> = Required<{
  [K in keyof T as Type extends T[K] ? K : never]: T[K];
}>;

// Note - don't use if the type
export type TFNestedOmit<
  Schema,
  Path extends string,
> = Path extends `${infer Head}.${infer Tail}`
  ? Head extends keyof Schema
    ? {
        [Key in keyof Schema]: Key extends Head
          ? TFNestedOmit<Schema[Key], Tail>
          : Schema[Key];
      }
    : Schema
  : Omit<Schema, Path>;
