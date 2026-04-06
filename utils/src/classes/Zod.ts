// Third party imports
import { z, type ZodString, type ZodType, type ZodOptional, type ZodNullable, ZodCoercedNumber, ZodNumber, ZodEmail, type ZodError } from "zod";

// User imports
import type { FieldValidationErrorMsg, NumberFieldValidationErrorMsg, StringFieldValidationErrorMsg } from "../types.ts";
import { CustomError, CustomErrorInfo } from "./../errors/CustomError.ts";
import { utilsMessages as messages } from "./../config/messages.ts";
import { createNumberFieldValidationErrorMsg, createStringFieldValidationErrorMsg } from "./../classes/FieldValidationErrorMsgs.ts";
import { FieldDefinition, NumberFieldDefinition, StringFieldDefinition } from "./FieldDefinition.ts";
import { FieldValidations, NumberFieldValidations, StringFieldValidations } from "./FieldValidations.ts";
import { FieldTransformations, NumberFieldTransformations, StringFieldTransformations } from "./FieldTransformations.ts";
// import { mongoFieldDefinitions } from "../config/definitions.ts";

export class ZodCustomError extends CustomError {
  constructor(message: string, info?: Omit<CustomErrorInfo, "scope">) {
    super(message, { ...info, scope: messages.ZOD.SCOPE });
  }
}

export type ZodNullish<T extends ZodType> = ZodOptional<ZodNullable<T>>;

abstract class ZodSchema<
  TValidations extends FieldValidations,
  TTransformations extends FieldTransformations,
  TFieldDefinition extends FieldDefinition<TValidations, TTransformations>,
  TFieldValidationErrorMsg extends FieldValidationErrorMsg,
> {
  protected _fieldDefinition!: TFieldDefinition;
  protected _validationMessages?: TFieldValidationErrorMsg;

  constructor(fieldDefinition: TFieldDefinition, validationMessages?: TFieldValidationErrorMsg) {
    this.fieldDefinition = fieldDefinition;
    if (validationMessages) this._validationMessages = { ...validationMessages };
  }

  get fieldDefinition(): Readonly<TFieldDefinition> {
    return this._fieldDefinition;
  }

  get validationMessages(): Readonly<TFieldValidationErrorMsg | undefined> {
    return this._validationMessages;
  }

  set fieldDefinition(fieldDefinition: TFieldDefinition) {
    if (fieldDefinition.isAutoValidate !== true) fieldDefinition.validate();
    this._fieldDefinition = fieldDefinition;
  }

  set validationMessages(validationsMessages: TFieldValidationErrorMsg | undefined) {
    this._validationMessages = validationsMessages ? { ...validationsMessages } : validationsMessages;
  }
}

export class StringZodSchema<
  TFieldValidations extends StringFieldValidations,
  TFieldTranformations extends StringFieldTransformations,
  TFieldDefinition extends StringFieldDefinition<TFieldValidations, TFieldTranformations>,
  TFieldValidationErrorMsg extends StringFieldValidationErrorMsg,
> extends ZodSchema<TFieldValidations, TFieldTranformations, TFieldDefinition, TFieldValidationErrorMsg> {
  constructor(fieldDefinition: TFieldDefinition, validationMessages?: TFieldValidationErrorMsg) {
    super(fieldDefinition, validationMessages);
  }

  build() {
    const validationMessages: StringFieldValidationErrorMsg = createStringFieldValidationErrorMsg(this._fieldDefinition, this._validationMessages);
    const validations: Readonly<TFieldValidations> = this._fieldDefinition.validations;
    const transformations: Readonly<TFieldTranformations> = this._fieldDefinition.transformations;

    // Constructing zod schema
    let schema: ZodEmail | ZodString;
    if (validations.isEmail === true) {
      schema = z.email({
        error: (issue) => {
          if ((issue.input === undefined || issue.input === null) && validations.isRequired === true) return validationMessages.required;
          if (issue.code === "invalid_format") return validationMessages.invalidEmail;
          if (issue.code === "invalid_type") return validationMessages.invalidType;
          return validationMessages.invalidValue;
        },
      });
    } else {
      schema = z.string({
        error: (issue) => {
          if ((issue.input === undefined || issue.input === null) && validations.isRequired === true) return validationMessages.required;
          if (issue.code === "invalid_type") return validationMessages.invalidType;
          return validationMessages.invalidValue;
        },
      });
    }

    if (validations.isNoSpaces === true) schema = schema.regex(/^\S*$/, validationMessages.noSpaces);
    if (transformations.isTrim === true) schema = schema.trim();
    if (transformations.isToLowerCase === true) schema = schema.toLowerCase();
    if (transformations.isToUpperCase === true) schema = schema.toUpperCase();
    if (typeof validations.minLength === "number") schema = schema.min(validations.minLength, validationMessages.minLength);
    if (typeof validations.maxLength === "number") schema = schema.max(validations.maxLength, validationMessages.maxLength);

    // type SchemaType = (typeof validations)["isEmail"] extends true ? ZodEmail : ZodString;
    // type ReturnSchemaType = (typeof validations)["isRequired"] extends true ? SchemaType : ZodNullish<SchemaType>;

    return validations.isRequired === true ? schema : schema.nullish();
  }
}

export class NumberZodSchema<
  TFieldValidations extends NumberFieldValidations,
  TFieldTranformations extends NumberFieldTransformations,
  TFieldDefinition extends NumberFieldDefinition<TFieldValidations, TFieldTranformations>,
  TFieldValidationErrorMsg extends NumberFieldValidationErrorMsg,
> extends ZodSchema<TFieldValidations, TFieldTranformations, TFieldDefinition, TFieldValidationErrorMsg> {
  constructor(fieldDefinition: TFieldDefinition, validationMessages?: TFieldValidationErrorMsg) {
    super(fieldDefinition, validationMessages);
  }

  build() {
    const validationMessages: NumberFieldValidationErrorMsg = createNumberFieldValidationErrorMsg(this._fieldDefinition, this._validationMessages);
    const validations: Readonly<TFieldValidations> = this._fieldDefinition.validations;
    const transformations: Readonly<TFieldTranformations> = this._fieldDefinition.transformations;

    const errorHandler: z.core.$ZodErrorMap = (issue) => {
      if ((issue.input === null || issue.input === undefined) && validations.isRequired === true) return validationMessages.required;
      if (issue.code === "invalid_type") return validationMessages.invalidType;
      return validationMessages.invalidValue;
    };

    let schema: ZodNumber | ZodCoercedNumber = transformations.isCoerce === true ? z.coerce.number({ error: errorHandler }) : z.number({ error: errorHandler });

    if (typeof validations.minValue === "number") schema = schema.min(validations.minValue, validationMessages.minValue);
    if (typeof validations.maxValue === "number") schema = schema.max(validations.maxValue, validationMessages.maxValue);

    type SchemaType = (typeof transformations)["isCoerce"] extends true ? ZodCoercedNumber : ZodNumber;
    type ReturnSchemaType = (typeof validations)["isRequired"] extends true ? SchemaType : ZodNullish<SchemaType>;

    return validations.isRequired === true ? schema : (schema.nullish() as ReturnSchemaType);
  }
}
export class ZodHelpers {
  static parseZodError<TJoin extends boolean>(error: ZodError): string[];
  static parseZodError(error: ZodError, isJoin: boolean): string;
  static parseZodError(error: ZodError, isJoin?: boolean): string[] | string {
    const errors = error.issues.map((issue) => issue.message);
    return isJoin ? errors.join("\n") : errors;
  }
}

// type SchemaType = (typeof validations)["isEmail"] extends true ? ZodEmail : ZodString;
// type ReturnSchemaType = (typeof validations)["isRequired"] extends true ? SchemaType : ZodNullish<SchemaType>;
