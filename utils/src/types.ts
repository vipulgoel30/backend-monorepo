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

// ////////////////////////////////////////////////
// /// FIELD VALIDATIONS
// ////////////////////////////////////////////////
// export interface BaseFieldValidations<TRequired extends boolean, TType extends FieldTypes> {
//   field: string;
//   type: TType;
//   isRequired?: TRequired;
// }

// interface BaseStringFieldValidations<TRequired extends boolean, TType extends FieldTypes> extends BaseFieldValidations<TRequired, TType> {
//   minLength?: number;
//   maxLength?: number;
//   isNoSpaces?: boolean;
// }

// export interface StringFieldValidations<TRequired extends boolean> extends BaseStringFieldValidations<TRequired, FieldTypes.string> {}

// export interface EmailFieldValidations<TRequired extends boolean> extends BaseStringFieldValidations<TRequired, FieldTypes.email> {}

// export interface NumberFieldValidations<TRequired extends boolean> extends BaseFieldValidations<TRequired, FieldTypes.number> {
//   minValue?: number;
//   maxValue?: number;
// }

// interface FieldValidationsMap<TRequired extends boolean> {
//   [FieldTypes.string]: StringFieldValidations<TRequired>;
//   [FieldTypes.email]: EmailFieldValidations<TRequired>;
//   [FieldTypes.number]: NumberFieldValidations<TRequired>;
// }

// export type FieldValidations<TRequired extends boolean, TType extends FieldTypes> = FieldValidationsMap<TRequired>[TType];
// export type GFieldValidations = FieldValidations<boolean, FieldTypes>;

// ////////////////////////////////////////////////
// /// FIELD TRANSFORMATIONS
// ////////////////////////////////////////////////

// interface BaseFieldTransformations {}

// interface BaseStringFieldTransformations extends BaseFieldTransformations {
//   isTrim?: boolean;
//   isToLowerCase?: boolean;
//   isToUpperCase?: boolean;
// }

// interface StringFieldTransformations extends BaseStringFieldTransformations {}
// interface EmailFieldTransformations extends BaseStringFieldTransformations {}

// interface NumberFieldTransformations extends BaseFieldTransformations {
//   isCoerce?: boolean;
// }

// interface FieldTransformationsMap {
//   [FieldTypes.string]: StringFieldTransformations;
//   [FieldTypes.email]: EmailFieldTransformations;
//   [FieldTypes.number]: NumberFieldTransformations;
// }

// export type FieldTransformations<TType extends FieldTypes> = FieldTransformationsMap[TType];
// export type GFieldTransformations = FieldTransformations<FieldTypes>;

// export interface FieldValidationTransformation<TRequired extends boolean, TType extends FieldTypes> {
//   validations: FieldValidations<TRequired, TType>;
//   transformations: FieldTransformations<TType>;
// }

// export type GFieldValidationTransformation = FieldValidationTransformation<boolean, FieldTypes>;

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

// interface FieldValidationErrorMsgMap {
//   [FieldTypes.string]: StringFieldValidationErrorMsg;
//   [FieldTypes.number]: NumberFieldValidationErrorMsg;
// }

// export type FieldValidationErrorMsg<TType extends FieldTypes> = FieldValidationErrorMsgMap[TType];

////////////////////////////////////////////////
/// FIELD VALIDATION MESSAGES RESOLVER
////////////////////////////////////////////////

// type ResolveBaseFieldValidationErrorMsg<TValidations extends GFieldValidations> = {
//   invalidValue?: string;
//   invalidType?: string;
// } & (TValidations["isRequired"] extends true ? { required: string } : {});

// type ResolveBaseStringFieldValidationErrorMsg<TValidations extends FieldValidations<boolean, FieldTypes.string | FieldTypes.email>> =
//   ResolveBaseFieldValidationErrorMsg<TValidations> &
//     (TValidations["minLength"] extends number ? { minLength: string } : {}) &
//     (TValidations["maxLength"] extends number ? { maxLength: string } : {}) &
//     (TValidations["isNoSpaces"] extends true ? { noSpaces: string } : {});

// type ResolveStringFieldValidationErrorMsg<TValidations extends FieldValidations<boolean, FieldTypes.string>> = ResolveBaseStringFieldValidationErrorMsg<TValidations>;

// type ResolveEmailFieldValidationErrorMsg<TValidations extends FieldValidations<boolean, FieldTypes.email>> = ResolveBaseStringFieldValidationErrorMsg<TValidations> & {
//   invalidEmail?: string;
// };

// type ResolveNumberFieldValidationErrorMsg<TValidations extends FieldValidations<boolean, FieldTypes.number>> = ResolveBaseFieldValidationErrorMsg<TValidations> &
//   (TValidations["minValue"] extends number ? { minValue: string } : {}) &
//   (TValidations["maxValue"] extends number ? { maxValue: string } : {});

// export type ResolveFieldValidationErrorMsg<TValidations extends GFieldValidations> =
//   TValidations extends FieldValidations<boolean, FieldTypes.string>
//     ? ResolveStringFieldValidationErrorMsg<TValidations>
//     : TValidations extends FieldValidations<boolean, FieldTypes.number>
//       ? ResolveNumberFieldValidationErrorMsg<TValidations>
//       : TValidations extends FieldValidations<boolean, FieldTypes.email>
//         ? ResolveEmailFieldValidationErrorMsg<TValidations>
//         : ResolveBaseFieldValidationErrorMsg<TValidations>;
