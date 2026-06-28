// Third party imports
import {
  z,
  type ZodString,
  type ZodType,
  type ZodOptional,
  type ZodNullable,
  ZodCoercedNumber,
  ZodNumber,
  ZodEmail,
  type ZodError,
} from "zod";

// User imports
import type {
  TArrayFieldValidationErrors,
  TFieldValidationErrors,
  TNumberFieldValidationErrors,
  TStringFieldValidationErrors,
} from "../types/types.ts";
import {
  TGArrayFieldDefinition,
  TGFieldDefinition,
  TGNumberFieldDefintion,
  TGStringFieldDefinition,
} from "./../classes/fieldDefinition/FieldDefinition.ts";
import {
  NumberFieldValidationErrors,
  StringFieldValidationErrors,
} from "./../classes/fieldDefinition/FieldValidationErrorMsgs.ts";
import BaseClass from "./Base.ts";

export class ZodHelpers {
  static parseZodError<TJoin extends boolean>(error: ZodError): string[];
  static parseZodError(error: ZodError, isJoin: boolean): string;
  static parseZodError(error: ZodError, isJoin: boolean = true): string[] | string {
    const errors = error.issues.map((issue) => issue.message);
    return isJoin ? errors.join("\n") : errors;
  }
}

interface TZodSchemaConstructorOptions<
  TPFieldDefinition extends TGFieldDefinition,
  TPFieldValidationErrors extends TFieldValidationErrors,
> {
  fieldDefinition: TPFieldDefinition;
  validationErrors?: TPFieldValidationErrors;
}

export interface TStringZodSchemaConstructorOptions<
  TPStringFieldDefinition extends TGStringFieldDefinition,
> extends TZodSchemaConstructorOptions<TPStringFieldDefinition, TStringFieldValidationErrors> {}

export interface TNumberZodSchemaConstructorOptions<
  TPNumberFieldDefinition extends TGNumberFieldDefintion,
> extends TZodSchemaConstructorOptions<TPNumberFieldDefinition, TNumberFieldValidationErrors> {}

export interface TArrayZodSchemaConstructorOptions<
  TPArrayFieldDefinition extends TGArrayFieldDefinition,
> extends TZodSchemaConstructorOptions<TPArrayFieldDefinition, TArrayFieldValidationErrors> {}

export type ZodNullish<T extends ZodType> = ZodOptional<ZodNullable<T>>;

abstract class ZodSchema<TPFieldDefinition extends TGFieldDefinition> extends BaseClass {
  protected readonly _fieldDefinition: TPFieldDefinition;
  protected readonly _validationErrors?: TFieldValidationErrors;

  constructor(options: TZodSchemaConstructorOptions<TPFieldDefinition, TFieldValidationErrors>) {
    super();
    this._fieldDefinition = options.fieldDefinition;
    if (options.validationErrors) this._validationErrors = { ...options.validationErrors };
  }

  get fieldDefinition(): TPFieldDefinition {
    return this._fieldDefinition;
  }

  get validationErrors(): TFieldValidationErrors | undefined {
    return this._validationErrors;
  }

  getCurrentConstructorOptions(): TZodSchemaConstructorOptions<TPFieldDefinition, TFieldValidationErrors> {
    return {
      fieldDefinition: this._fieldDefinition,
      validationErrors: this._validationErrors,
    };
  }

  toJSON(): Record<string, any> {
    return {
      fieldDefinition: this._fieldDefinition.toJSON(),
      validationErrors: this._validationErrors,
    };
  }

  abstract setFieldDefinition(...args: any[]): any;
  abstract setValidationErrors(...args: any[]): any;
}

export class StringZodSchema<
  TPStringFieldDefinition extends TGStringFieldDefinition,
> extends ZodSchema<TPStringFieldDefinition> {
  constructor(options: TStringZodSchemaConstructorOptions<TPStringFieldDefinition>) {
    super(options);
  }

  setFieldDefinition<TPStringFieldDefinitionCur extends TGStringFieldDefinition>(
    fieldDefinition: TPStringFieldDefinitionCur,
  ): StringZodSchema<TPStringFieldDefinitionCur> {
    return new StringZodSchema({
      ...this.getCurrentConstructorOptions(),
      fieldDefinition,
    });
  }
  setValidationErrors(validationErrors: TStringFieldValidationErrors): StringZodSchema<TPStringFieldDefinition> {
    return new StringZodSchema({
      ...this.getCurrentConstructorOptions(),
      validationErrors,
    });
  }

  clone() {
    return new StringZodSchema(this.getCurrentConstructorOptions());
  }

  getCurrentConstructorOptions(): TStringZodSchemaConstructorOptions<TPStringFieldDefinition> {
    return {
      ...super.getCurrentConstructorOptions(),
    };
  }

  build() {
    const validationMessages = new StringFieldValidationErrors({
      fieldDefinition: this._fieldDefinition,
      defaultErrors: this._validationErrors,
    }).build();

    const validations: TPStringFieldDefinition["validations"] = this._fieldDefinition.validations;

    const transformations: TPStringFieldDefinition["transformations"] = this._fieldDefinition.transformations;

    // Constructing zod schema
    let schema: ZodEmail | ZodString;
    if (validations.isEmail === true) {
      schema = z.email({
        error: (issue) => {
          if ((issue.input === undefined || issue.input === null) && validations.isRequired === true)
            return validationMessages.required;
          if (issue.code === "invalid_format") return validationMessages.invalidEmail;
          if (issue.code === "invalid_type") return validationMessages.invalidType;
          return validationMessages.invalidValue;
        },
      });
    } else {
      schema = z.string({
        error: (issue) => {
          if ((issue.input === undefined || issue.input === null) && validations.isRequired === true)
            return validationMessages.required;
          if (issue.code === "invalid_type") return validationMessages.invalidType;
          return validationMessages.invalidValue;
        },
      });
    }

    if (validations.isNoSpaces === true) schema = schema.regex(/^\S*$/, validationMessages.noSpaces);
    if (transformations.isTrim === true) schema = schema.trim();
    if (transformations.isToLowerCase === true) schema = schema.toLowerCase();
    if (transformations.isToUpperCase === true) schema = schema.toUpperCase();
    if (typeof validations.minLength === "number")
      schema = schema.min(validations.minLength, validationMessages.minLength);
    if (typeof validations.maxLength === "number")
      schema = schema.max(validations.maxLength, validationMessages.maxLength);

    type SchemaType = (typeof validations)["isEmail"] extends true ? ZodEmail : ZodString;
    type ReturnSchemaType = (typeof validations)["isRequired"] extends true ? SchemaType : ZodNullish<SchemaType>;

    return (validations.isRequired === true ? schema : schema.nullish()) as ReturnSchemaType;
  }
}

export class NumberZodSchema<
  TPNumberFieldDefinition extends TGNumberFieldDefintion,
  TPInputTypeForCoerce = string,
> extends ZodSchema<TPNumberFieldDefinition> {
  constructor(options: TNumberZodSchemaConstructorOptions<TPNumberFieldDefinition>) {
    super(options);
  }

  setFieldDefinition<TPNumberFieldDefinitionCur extends TGNumberFieldDefintion>(
    fieldDefinition: TPNumberFieldDefinitionCur,
  ): NumberZodSchema<TPNumberFieldDefinitionCur> {
    return new NumberZodSchema({
      ...this.getCurrentConstructorOptions(),
      fieldDefinition,
    });
  }

  setValidationErrors(validationErrors: TNumberFieldValidationErrors): NumberZodSchema<TPNumberFieldDefinition> {
    return new NumberZodSchema({
      ...this.getCurrentConstructorOptions(),
      validationErrors,
    });
  }

  clone() {
    return new NumberZodSchema(this.getCurrentConstructorOptions());
  }

  getCurrentConstructorOptions(): TNumberZodSchemaConstructorOptions<TPNumberFieldDefinition> {
    return {
      ...super.getCurrentConstructorOptions(),
    };
  }

  build() {
    const validationMessages: TNumberFieldValidationErrors = new NumberFieldValidationErrors({
      fieldDefinition: this._fieldDefinition,
      defaultErrors: this._validationErrors,
    }).build();

    const validations: TPNumberFieldDefinition["validations"] = this._fieldDefinition.validations;
    const transformations: TPNumberFieldDefinition["transformations"] = this._fieldDefinition.transformations;

    const errorHandler: z.core.$ZodErrorMap = (issue) => {
      if ((issue.input === null || issue.input === undefined) && validations.isRequired === true)
        return validationMessages.required;
      if (issue.code === "invalid_type") return validationMessages.invalidType;
      return validationMessages.invalidValue;
    };

    let schema: ZodNumber | ZodCoercedNumber =
      transformations.isCoerce === true ? z.coerce.number({ error: errorHandler }) : z.number({ error: errorHandler });

    if (typeof validations.minValue === "number")
      schema = schema.min(validations.minValue, validationMessages.minValue);
    if (typeof validations.maxValue === "number")
      schema = schema.max(validations.maxValue, validationMessages.maxValue);

    type SchemaType = (typeof transformations)["isCoerce"] extends true
      ? ZodCoercedNumber<TPInputTypeForCoerce>
      : ZodNumber;
    type ReturnSchemaType = (typeof validations)["isRequired"] extends true ? SchemaType : ZodNullish<SchemaType>;

    return (validations.isRequired === true ? schema : schema.nullish()) as ReturnSchemaType;
  }
}

// export class ArrayZodSchema<
//   TPArrayFieldDefinition extends TGArrayFieldDefinition,
// > extends ZodSchema<TPArrayFieldDefinition> {
//   constructor(
//     options: TArrayZodSchemaConstructorOptions<TPArrayFieldDefinition>,
//   ) {
//     super(options);
//   }

//   setFieldDefinition<TPArrayFieldDefinitionCur extends TPArrayFieldDefinition>(
//     fieldDefinition: TPArrayFieldDefinitionCur,
//   ): ArrayZodSchema<TPArrayFieldDefinitionCur> {
//     return new ArrayZodSchema({
//       ...this.getCurrentConstructorOptions(),
//       fieldDefinition,
//     });
//   }
//   setValidationErrors(
//     validationErrors: TArrayFieldValidationErrors,
//   ): ArrayZodSchema<TPArrayFieldDefinition> {
//     return new ArrayZodSchema({
//       ...this.getCurrentConstructorOptions(),
//       validationErrors,
//     });
//   }
//   clone() {
//     return new ArrayZodSchema(this.getCurrentConstructorOptions());
//   }

//   getCurrentConstructorOptions(): TArrayZodSchemaConstructorOptions<TPArrayFieldDefinition> {
//     return {
//       ...super.getCurrentConstructorOptions(),
//     };
//   }

//   build() {
//     const validationMessages: TArrayFieldValidationErrors =
//       new ArrayFieldValidationErrors({
//         fieldDefinition: this._fieldDefinition,
//         defaultErrors: this._validationErrors,
//       }).build();

//     const validations: TPArrayFieldDefinition["validations"] =
//       this._fieldDefinition.validations;

//     const elementsFieldDefinition: TPArrayFieldDefinition["elementsFieldDefinition"] =
//       this._fieldDefinition.elementsFieldDefinition;

//     // TODO - make the elementsFieldZodSchema to extract actual type
//     // instead of any
//     let elementsFieldZodSchema: any = z.any();
//     if (elementsFieldDefinition instanceof StringFieldDefinition) {
//       elementsFieldZodSchema = new StringZodSchema({
//         fieldDefinition: elementsFieldDefinition,
//       }).build();
//     } else if (elementsFieldDefinition instanceof NumberFieldDefinition) {
//       elementsFieldZodSchema = new NumberZodSchema({
//         fieldDefinition: elementsFieldDefinition,
//       }).build();
//     } else if (elementsFieldDefinition instanceof ArrayFieldDefinition) {
//       elementsFieldZodSchema = new ArrayZodSchema({
//         fieldDefinition: elementsFieldDefinition,
//       }).build();
//     }

//     let schema = z.array(elementsFieldZodSchema, {
//       error: (issue) => {
//         if (
//           (issue.input === null || issue.input === undefined) &&
//           validations.isRequired
//         ) {
//           return validationMessages.required;
//         }
//         if (issue.code === "invalid_type")
//           return validationMessages.invalidType;
//         return validationMessages.invalidValue;
//       },
//     });
//     if (typeof validations.length === "number")
//       schema = schema.length(
//         validations.length,
//         validationMessages.invalidLength,
//       );

//     if (typeof validations.minLength === "number")
//       schema = schema.min(validations.minLength, validationMessages.minLength);

//     if (typeof validations.maxLength === "number")
//       schema = schema.max(validations.maxLength, validationMessages.maxLength);

//     return schema;
//   }
// // }

// // const test = new ArrayZodSchema({
// //   fieldDefinition: new ArrayFieldDefinition({
// //     validations: new ArrayFieldValidations({
// //       ...ArrayFieldValidations.getDefaultConstructorOptions(),
// //       field: "dbuwudw",
// //       isRequired: true,
// //     }),
// //     transformations: new ArrayFieldTransformations({
// //       ...ArrayFieldTransformations.getDefaultConstructorOptions(),
// //     }),
// //     elementsFieldDefinition: new StringFieldDefinition({
// //       validations: new StringFieldValidations({
// //         ...StringFieldValidations.getDefaultConstructorOptions(),
// //         field: "duwdu2",
// //       }),
// //       transformations: new StringFieldTransformations({
// //         ...StringFieldTransformations.getDefaultConstructorOptions(),
// //       }),
// //     }),
// //   }),
// // }).build();

// // // type test1 = z.infer<typeof test>;
