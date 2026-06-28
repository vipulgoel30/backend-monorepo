// Third party imports
import { type SchemaTypeOptions } from "mongoose";

// User imports
import {
  TGFieldDefinition,
  TGNumberFieldDefintion,
  TGStringFieldDefinition,
} from "./../classes/fieldDefinition/FieldDefinition.ts";
import {
  TFieldValidationErrors,
  TNumberFieldValidationErrors,
  TStringFieldValidationErrors,
} from "../types/types.ts";
import BaseClass from "./Base.ts";
import {
  NumberFieldValidationErrors,
  StringFieldValidationErrors,
} from "./fieldDefinition/FieldValidationErrorMsgs.ts";

export interface TMongoCustomValidation<TPSchemaType> {
  validator: (value: TPSchemaType) => boolean;
  message: string;
}

interface TMongoSchemaConstructorOptions<
  TPFieldDefinitions extends TGFieldDefinition,
  TPFieldValidationErrors extends TFieldValidationErrors,
  TPSchemaType,
> {
  fieldDefinition: TPFieldDefinitions;
  entity: string;
  validationErrors?: TPFieldValidationErrors;
  customValidations?: TMongoCustomValidation<TPSchemaType>[];
}

export interface TStringMongoSchemaConstructorOptions<
  TPStringFieldDefinitions extends TGStringFieldDefinition,
> extends TMongoSchemaConstructorOptions<
  TPStringFieldDefinitions,
  TStringFieldValidationErrors,
  string
> {}

export interface TNumberMongoSchemaConstructorOptions<
  TPNumberFieldDefinitions extends TGNumberFieldDefintion,
> extends TMongoSchemaConstructorOptions<
  TPNumberFieldDefinitions,
  TNumberFieldValidationErrors,
  number
> {}

// export interface TArrayMongoSchemaConstructorOptions<
//   TPArrayFieldDefinition extends TGArrayFieldDefinition,
// > extends TMongoSchemaConstructorOptions<
//   TPArrayFieldDefinition,
//   TArrayFieldValidationErrors,
//   ExtractFieldType<TPArrayFieldDefinition["elementsFieldDefinition"]>
// > {
//   // elementsValidationErrors?:
// }

abstract class MongoSchema<
  TPFieldDefinitions extends TGFieldDefinition,
  TPFieldValidationErrors extends TFieldValidationErrors,
  TPSchemaType,
> extends BaseClass {
  protected readonly _fieldDefinition: TPFieldDefinitions;
  protected readonly _entity: string;
  protected readonly _validationErrors?: TPFieldValidationErrors;
  protected readonly _customValidations: TMongoCustomValidation<TPSchemaType>[];

  constructor(
    options: TMongoSchemaConstructorOptions<
      TPFieldDefinitions,
      TPFieldValidationErrors,
      TPSchemaType
    >,
  ) {
    super();
    this._fieldDefinition = options.fieldDefinition;
    this._entity = options.entity;
    if (options.validationErrors)
      this._validationErrors = { ...options.validationErrors };
    this._customValidations = options.customValidations
      ? this._cloneCustomValidations(options.customValidations)
      : [];
  }

  get fieldDefinition(): TPFieldDefinitions {
    return this._fieldDefinition;
  }

  get entity(): string {
    return this._entity;
  }

  get validationErrors(): Readonly<TPFieldValidationErrors | undefined> {
    return this._validationErrors;
  }

  get customValidations(): Readonly<TMongoCustomValidation<TPSchemaType>[]> {
    return this._customValidations;
  }

  toJSON() {
    return {
      fieldDefinition: this._fieldDefinition,
      entity: this._entity,
      validationErrors: this._validationErrors,
      customValidations: this._customValidations,
    };
  }

  getCurrentConstructorOptions(): TMongoSchemaConstructorOptions<
    TPFieldDefinitions,
    TPFieldValidationErrors,
    TPSchemaType
  > {
    return {
      fieldDefinition: this._fieldDefinition,
      entity: this._entity,
      validationErrors: this._validationErrors,
      customValidations: this._customValidations,
    };
  }

  protected _cloneCustomValidations(
    customValidations: TMongoCustomValidation<TPSchemaType>[],
  ): TMongoCustomValidation<TPSchemaType>[] {
    return customValidations.map((customValidation) => ({
      ...customValidation,
    }));
  }

  abstract setFieldDefinition(...args: any): any;
  abstract setEntity(...args: any): any;
  abstract addCustomValidations(...args: any): any;
  abstract setCustomValidations(...args: any): any;
  abstract setValidationErrors(...args: any): any;
}

export class StringMongoSchema<
  TPStringFieldDefinitions extends TGStringFieldDefinition,
> extends MongoSchema<
  TPStringFieldDefinitions,
  TStringFieldValidationErrors,
  string
> {
  constructor(
    options: TStringMongoSchemaConstructorOptions<TPStringFieldDefinitions>,
  ) {
    super(options);
  }

  getCurrentConstructorOptions(): TStringMongoSchemaConstructorOptions<TPStringFieldDefinitions> {
    return {
      ...super.getCurrentConstructorOptions(),
    };
  }

  setFieldDefinition<
    TPStringFieldDefinitionCur extends TGStringFieldDefinition,
  >(
    fieldDefinition: TPStringFieldDefinitionCur,
  ): StringMongoSchema<TPStringFieldDefinitionCur> {
    return new StringMongoSchema({
      ...this.getCurrentConstructorOptions(),
      fieldDefinition,
    });
  }
  setEntity(entity: string): StringMongoSchema<TPStringFieldDefinitions> {
    return new StringMongoSchema({
      ...this.getCurrentConstructorOptions(),
      entity,
    });
  }

  addCustomValidations(
    customValidation: TMongoCustomValidation<string>,
  ): StringMongoSchema<TPStringFieldDefinitions> {
    return new StringMongoSchema({
      ...this.getCurrentConstructorOptions(),
      customValidations: [...this.customValidations, { ...customValidation }],
    });
  }

  setCustomValidations(
    customValidations: TMongoCustomValidation<string>[],
  ): StringMongoSchema<TPStringFieldDefinitions> {
    return new StringMongoSchema({
      ...this.getCurrentConstructorOptions(),
      customValidations: this._cloneCustomValidations(customValidations),
    });
  }
  setValidationErrors(
    validationErrors: TStringFieldValidationErrors,
  ): StringMongoSchema<TPStringFieldDefinitions> {
    return new StringMongoSchema({
      ...this.getCurrentConstructorOptions(),
      validationErrors,
    });
  }
  clone() {
    return new StringMongoSchema(this.getCurrentConstructorOptions());
  }

  build(): SchemaTypeOptions<string> {
    const validationErrors: TStringFieldValidationErrors =
      new StringFieldValidationErrors({
        fieldDefinition: this._fieldDefinition,
        defaultErrors: this._validationErrors,
      }).build();
    const validations: TPStringFieldDefinitions["validations"] =
      this._fieldDefinition.validations;
    const transformations: TPStringFieldDefinitions["transformations"] =
      this._fieldDefinition.transformations;

    const schema: SchemaTypeOptions<string> = { type: String };
    if (transformations?.isTrim === true) schema.trim = true;

    if (typeof validations.minLength === "number")
      schema.minLength = [validations.minLength, validationErrors.minLength!];
    if (typeof validations.maxLength === "number")
      schema.maxLength = [validations.maxLength, validationErrors.maxLength!];
    if (validations.isRequired === true)
      schema.required = [true, validationErrors.required!];
    if (this._customValidations.length > 0)
      schema.validate = this._customValidations;

    return schema;
  }
}

export class NumberMongoSchema<
  TPNumberFieldDefinitions extends TGNumberFieldDefintion,
> extends MongoSchema<
  TPNumberFieldDefinitions,
  TNumberFieldValidationErrors,
  number
> {
  constructor(
    options: TNumberMongoSchemaConstructorOptions<TPNumberFieldDefinitions>,
  ) {
    super(options);
  }

  getCurrentConstructorOptions(): TNumberMongoSchemaConstructorOptions<TPNumberFieldDefinitions> {
    return {
      ...super.getCurrentConstructorOptions(),
    };
  }

  setFieldDefinition<TPNumberFieldDefinitionCur extends TGNumberFieldDefintion>(
    fieldDefinition: TPNumberFieldDefinitionCur,
  ): NumberMongoSchema<TPNumberFieldDefinitionCur> {
    return new NumberMongoSchema({
      ...this.getCurrentConstructorOptions(),
      fieldDefinition,
    });
  }

  setEntity(entity: string): NumberMongoSchema<TPNumberFieldDefinitions> {
    return new NumberMongoSchema({
      ...this.getCurrentConstructorOptions(),
      entity,
    });
  }

  addCustomValidations(
    customValidation: TMongoCustomValidation<number>,
  ): NumberMongoSchema<TPNumberFieldDefinitions> {
    return new NumberMongoSchema({
      ...this.getCurrentConstructorOptions(),
      customValidations: [...this.customValidations, { ...customValidation }],
    });
  }

  setCustomValidations(
    customValidations: TMongoCustomValidation<number>[],
  ): NumberMongoSchema<TPNumberFieldDefinitions> {
    return new NumberMongoSchema({
      ...this.getCurrentConstructorOptions(),
      customValidations: this._cloneCustomValidations(customValidations),
    });
  }

  setValidationErrors(
    validationErrors: TNumberFieldValidationErrors,
  ): NumberMongoSchema<TPNumberFieldDefinitions> {
    return new NumberMongoSchema({
      ...this.getCurrentConstructorOptions(),
      validationErrors,
    });
  }

  clone(): NumberMongoSchema<TPNumberFieldDefinitions> {
    return new NumberMongoSchema(this.getCurrentConstructorOptions());
  }

  build(): SchemaTypeOptions<number> {
    const validationErrors: TNumberFieldValidationErrors =
      new NumberFieldValidationErrors({
        fieldDefinition: this._fieldDefinition,
        defaultErrors: this._validationErrors,
      }).build();

    const validations: TPNumberFieldDefinitions["validations"] =
      this._fieldDefinition.validations;
    const transformations: TPNumberFieldDefinitions["transformations"] =
      this._fieldDefinition.transformations;

    const schema: SchemaTypeOptions<number> = { type: Number };
    if (typeof validations.minValue === "number")
      schema.min = [validations.minValue, validationErrors.minValue!];
    if (typeof validations.maxValue === "number")
      schema.max = [validations.maxValue, validationErrors.maxValue!];
    if (typeof validations.isRequired === "boolean")
      schema.required = [validations.isRequired, validationErrors.required!];
    if (typeof transformations.isCoerce === "boolean")
      schema.cast = transformations.isCoerce;
    if (this._customValidations.length > 0)
      schema.validate = this._customValidations;

    return schema;
  }
}

// export class ArrayMongoSchema<
//   TPArrayFieldDefinition extends TGArrayFieldDefinition,
// > extends MongoSchema<
//   TPArrayFieldDefinition,
//   TArrayFieldValidationErrors,
//   ExtractFieldType<TPArrayFieldDefinition["elementsFieldDefinition"]>
// > {
//   constructor(
//     options: TArrayMongoSchemaConstructorOptions<TPArrayFieldDefinition>,
//   ) {
//     super(options);
//   }

//   setFieldDefinition(...args: any) {
//     throw new Error("Method not implemented.");
//   }
//   setEntity(...args: any) {
//     throw new Error("Method not implemented.");
//   }
//   addCustomValidations(...args: any) {
//     throw new Error("Method not implemented.");
//   }
//   setCustomValidations(...args: any) {
//     throw new Error("Method not implemented.");
//   }
//   setValidationErrors(...args: any) {
//     throw new Error("Method not implemented.");
//   }
//   clone() {
//     throw new Error("Method not implemented.");
//   }

//   build(): SchemaTypeOptions<
//     ExtractFieldType<TPArrayFieldDefinition["elementsFieldDefinition"]>
//   > {
//     const validationErrors: TArrayFieldValidationErrors =
//       new ArrayFieldValidationErrors({
//         fieldDefinition: this._fieldDefinition,
//         defaultErrors: this._validationErrors,
//       }).build();

//     const validations: TPArrayFieldDefinition["validations"] =
//       this._fieldDefinition.validations;
//     const transformations: TPArrayFieldDefinition["transformations"] =
//       this._fieldDefinition.transformations;
//     const elementsFieldDefinition: TPArrayFieldDefinition["elementsFieldDefinition"] =
//       this._fieldDefinition.elementsFieldDefinition;

//     let elementSchema = null;
//     if (elementsFieldDefinition instanceof StringFieldDefinition) {
//       elementSchema = new StringMongoSchema({
//         fieldDefinition: elementsFieldDefinition,
//       });
//     }
//   }
// }

// const test = new ArrayFieldDefinition({
//   validations: new ArrayFieldValidations({
//     ...ArrayFieldValidations.getDefaultConstructorOptions(),
//     field: "dwduww",
//     isRequired: true,
//   }),
//   transformations: new ArrayFieldTransformations({
//     ...ArrayFieldTransformations.getDefaultConstructorOptions(),
//   }),
//   elementsFieldDefinition: new ArrayFieldDefinition({
//     validations: new ArrayFieldValidations({
//       ...ArrayFieldValidations.getDefaultConstructorOptions(),
//       field: "dwudwu",
//     }),
//     transformations: new ArrayFieldTransformations({
//       ...ArrayFieldTransformations.getDefaultConstructorOptions(),
//     }),
//     elementsFieldDefinition: new NumberFieldDefinition({
//       validations: new NumberFieldValidations({
//         ...NumberFieldValidations.getDefaultConstructorOptions(),
//         field: "bwudwu",
//       }),

//       transformations: new NumberFieldTransformations({
//         ...NumberFieldTransformations.getDefaultConstructorOptions(),
//       }),
//     }),
//   }),
// });
