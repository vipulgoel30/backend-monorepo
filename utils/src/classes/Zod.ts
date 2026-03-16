// Third party imports
import { z, type ZodNumber, type ZodString, type ZodType, type ZodOptional, type ZodNullable, type ZodError, type ZodCoercedNumber } from "zod";

// User imports
import { StringFieldValidationRule, NumberFieldValidationRule, StringFieldTransformations } from "../types.ts";
import { InternalServerError } from "../errors/httpErrors/InternalServerError.ts";
import { utilsMessages as messages } from "../config/messages.ts";
import { NumberFieldValidationErrorMsg, StringFieldValidationErrorMsg } from "./FieldValidationErrorMsgs.ts";
import { formatStr } from "../utils.ts";

export type ZodNullish<T extends ZodType> = ZodOptional<ZodNullable<T>>;

export class StringZodSchema<TRequired extends boolean> {
  private _transformations: StringFieldTransformations = {};
  private _validationMessages?: StringFieldValidationErrorMsg<TRequired>;
  constructor(
    public readonly validations: StringFieldValidationRule<TRequired>,
    validationsMessages?: StringFieldValidationErrorMsg<TRequired>,
  ) {
    this._validationMessages = validationsMessages;
  }

  get transformations(): Readonly<StringFieldTransformations> {
    return this._transformations;
  }

  get validationMessages(): Readonly<StringFieldValidationErrorMsg<TRequired>> | undefined {
    return this._validationMessages;
  }

  addTransformations(transformations: StringFieldTransformations) {
    this._transformations = { ...this._transformations, ...transformations };
    return this;
  }

  build(): TRequired extends true ? ZodString : ZodNullish<ZodString> {
    //1. Config validations
    //1.1 Checking if both lowercase and uppercase tranformation is specified
    if (this._transformations.isToLowerCase && this._transformations.isToUpperCase) {
      throw new InternalServerError(formatStr(messages.INVALID_VALIDATION.CONFLICTING_CASE_TRANSFORM, { field: this.validations.field }));
    }

    //1.2 Checking if minLength > maxLength
    if (typeof this.validations.minLength === "number" && typeof this.validations.maxLength === "number" && this.validations.minLength > this.validations.maxLength) {
      throw new InternalServerError(formatStr(messages.INVALID_VALIDATION.LENGTH_RANGE, { field: this.validations.field }), {
        meta: this.validations,
      });
    }

    // If validation messages is not provided
    // creating the messages using validations
    const validationMessages = this._validationMessages ?? new StringFieldValidationErrorMsg(this.validations);

    //2. Initializing schema
    let schema: ZodString = z.string({
      error: (issue) => {
        if ((issue.input === undefined || issue.input === null) && this.validations.isRequired === true) return validationMessages.required;
        if (issue.code === "invalid_type") return validationMessages.invalidType;
        return validationMessages.invalidValue;
      },
    });

    //4. No whitespace validation
    if (this.validations.isNoSpaces === true) schema = schema.regex(/^\S*$/, validationMessages.noSpaces);

    //3. Trim validation
    if (this._transformations.isTrim === true) schema = schema.trim();

    //5. ToLowerCase Validation
    if (this._transformations.isToLowerCase === true) schema = schema.toLowerCase();

    //6. ToUpperCase Validation
    if (this._transformations.isToUpperCase === true) schema = schema.toUpperCase();

    //7. minLength validation
    if (typeof this.validations.minLength === "number") {
      if (this.validations.minLength < 0)
        throw new InternalServerError(formatStr(messages.INVALID_VALIDATION.MIN_LENGTH, { field: this.validations.field }), {
          meta: this.validations,
        });

      schema = schema.min(this.validations.minLength, validationMessages.minLength);
    }

    //8. maxLength validation
    if (typeof this.validations.maxLength === "number") {
      if (this.validations.maxLength < 0)
        throw new InternalServerError(formatStr(messages.INVALID_VALIDATION.MAX_LENGTH, { field: this.validations.field }), {
          meta: this.validations,
        });

      schema = schema.max(this.validations.maxLength, validationMessages.maxLength);
    }

    return (this.validations.isRequired === true ? schema : schema.nullish()) as TRequired extends true ? ZodString : ZodNullish<ZodString>;
  }
}

export class NumberZodSchema<TRequired extends boolean> {
  private _validationMessages?: NumberFieldValidationErrorMsg<TRequired>;
  private _isCoerce?: boolean;

  constructor(
    public readonly validations: NumberFieldValidationRule<TRequired>,
    validationsMessages?: NumberFieldValidationErrorMsg<TRequired>,
  ) {
    this._validationMessages = validationsMessages;
  }

  get validationMessages(): Readonly<NumberFieldValidationErrorMsg<TRequired>> | undefined {
    return this._validationMessages;
  }

  isCoerce() {
    this._isCoerce = true;
    return this;
  }

  build(): TRequired extends true ? ZodCoercedNumber : ZodNullish<ZodCoercedNumber> {
    //-- Config Check
    if (typeof this.validations.minValue === "number" && typeof this.validations.maxValue === "number" && this.validations.minValue > this.validations.maxValue) {
      throw new InternalServerError(formatStr(messages.INVALID_VALIDATION.MIN_MAX_VALUE_RANGE, { field: this.validations.field }), {
        meta: this.validations,
      });
    }

    // If validation messages is not provided
    // creating the messages using validations
    const validationMessages = new NumberFieldValidationErrorMsg(this.validations);

    const errorHandler: z.core.$ZodErrorMap = (issue) => {
      if ((issue.input === null || issue.input === undefined) && this.validations.isRequired) return validationMessages.required;
      if (issue.code === "invalid_type") return validationMessages.invalidType;
      return validationMessages.invalidValue;
    };

    let schema: ZodNumber = this._isCoerce ? z.coerce.number({ error: errorHandler }) : z.number({ error: errorHandler });

    if (typeof this.validations.minValue === "number") schema = schema.min(this.validations.minValue, validationMessages.minValue);
    if (typeof this.validations.maxValue === "number") schema = schema.max(this.validations.maxValue, validationMessages.maxValue);

    return (this.validations.isRequired === true ? schema : schema.nullish()) as TRequired extends true ? ZodCoercedNumber : ZodNullish<ZodCoercedNumber>;
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
