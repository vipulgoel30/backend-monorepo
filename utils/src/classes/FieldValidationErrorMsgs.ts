// User imports
import type {
  OnlyWithTypeParameter,
  TArrayFieldValidationErrors,
  TFieldValidationErrors,
  TNumberFieldValidationErrors,
  TStringFieldValidationErrors,
} from "../types/types.ts";
import { formatStr } from "../utils.ts";
import {
  TGArrayFieldDefinition,
  TGFieldDefinition,
  TGNumberFieldDefintion,
  TGStringFieldDefinition,
} from "./FieldDefinition.ts";
import { TGFieldValidations } from "./FieldValidations.ts";
import { utilsMessages as messages } from "../config/messages.ts";
import BaseClass from "./Base.ts";

interface TFieldValidationErrorsOptions<
  TPFieldDefinition extends TGFieldDefinition,
  TPFieldValidationErrors extends TFieldValidationErrors,
> {
  fieldDefinition: TPFieldDefinition;
  defaultErrors?: TPFieldValidationErrors;
}

export interface TStringFieldValidationErrorsOptions<
  TPStringFieldDefinition extends TGStringFieldDefinition,
  TPStringFieldValidationErrors extends TStringFieldValidationErrors,
> extends TFieldValidationErrorsOptions<
  TPStringFieldDefinition,
  TPStringFieldValidationErrors
> {}

export interface TNumberFieldValidationErrorsOptions<
  TPNumberFieldDefinition extends TGNumberFieldDefintion,
  TPNumberFieldValidationErrors extends TNumberFieldValidationErrors,
> extends TFieldValidationErrorsOptions<
  TPNumberFieldDefinition,
  TPNumberFieldValidationErrors
> {}

export interface TArrayFieldValidationErrorOptions<
  TPArrayFieldDefinition extends TGArrayFieldDefinition,
  TPArrayFieldValidationErrors extends TArrayFieldValidationErrors,
> extends TFieldValidationErrorsOptions<
  TPArrayFieldDefinition,
  TPArrayFieldValidationErrors
> {}

export abstract class FieldValidationErrors<
  TPFieldDefinition extends TGFieldDefinition,
  TPFieldValidationErrors extends TFieldValidationErrors,
> extends BaseClass {
  protected readonly _fieldDefinition: TPFieldDefinition;
  protected readonly _defaultErrors?: TPFieldValidationErrors;

  constructor(
    options: TFieldValidationErrorsOptions<
      TPFieldDefinition,
      TPFieldValidationErrors
    >,
  ) {
    super();
    this._fieldDefinition = options.fieldDefinition;
    if (options?.defaultErrors)
      this._defaultErrors = { ...options.defaultErrors };
  }

  get fieldDefinition(): TPFieldDefinition {
    return this._fieldDefinition;
  }

  toJSON() {
    return {
      fieldDefinition: this._fieldDefinition.toJSON(),
      defaultErrors: this._defaultErrors,
    };
  }

  getCurrentConstructorOptions(): TFieldValidationErrorsOptions<
    TPFieldDefinition,
    TPFieldValidationErrors
  > {
    return {
      fieldDefinition: this.fieldDefinition,
      defaultErrors: this._defaultErrors
        ? { ...this._defaultErrors }
        : this._defaultErrors,
    };
  }

  static getDefaultConstructorOptions(): OnlyWithTypeParameter<
    TFieldValidationErrorsOptions<TGFieldDefinition, TFieldValidationErrors>,
    boolean
  > {
    return {};
  }

  static invalidType(field: string, type: string, message?: string): string {
    return message ?? formatStr(messages.FIELD.INVALID_TYPE, { field, type });
  }

  static invalidValue(field: string, message?: string): string {
    return message ?? formatStr(messages.FIELD.INVALID_VALUE, { field });
  }

  static required(field: string, message?: string): string {
    return message ?? formatStr(messages.FIELD.REQUIRED, { field });
  }

  build(): TFieldValidationErrors {
    const validations: Readonly<TGFieldValidations> =
      this._fieldDefinition.validations;

    return {
      invalidValue: FieldValidationErrors.invalidValue(
        validations.field,
        this._defaultErrors?.invalidValue,
      ),
      invalidType: FieldValidationErrors.invalidType(
        validations.field,
        validations.type,
        this._defaultErrors?.invalidType,
      ),
      ...(validations.isRequired === true && {
        required: FieldValidationErrors.required(
          validations.field,
          this._defaultErrors?.required,
        ),
      }),
    };
  }
  abstract setFieldDefinition(...args: any[]): any;
  abstract setDefaultErrors(...args: any[]): any;
}

export class StringFieldValidationErrors<
  TPStringFieldDefinition extends TGStringFieldDefinition,
  TPStringFieldValidationErrors extends TStringFieldValidationErrors,
> extends FieldValidationErrors<
  TPStringFieldDefinition,
  TPStringFieldValidationErrors
> {
  constructor(
    options: TStringFieldValidationErrorsOptions<
      TPStringFieldDefinition,
      TPStringFieldValidationErrors
    >,
  ) {
    super({ ...options });
  }

  getCurrentConstructorOptions(): TStringFieldValidationErrorsOptions<
    TPStringFieldDefinition,
    TPStringFieldValidationErrors
  > {
    return {
      ...super.getCurrentConstructorOptions(),
    };
  }

  setFieldDefinition<
    TPStringFieldDefinitionCur extends TGStringFieldDefinition,
  >(
    fieldDefinition: TPStringFieldDefinitionCur,
  ): StringFieldValidationErrors<
    TPStringFieldDefinitionCur,
    TPStringFieldValidationErrors
  > {
    return new StringFieldValidationErrors({
      ...this.getCurrentConstructorOptions(),
      fieldDefinition,
    });
  }

  setDefaultErrors<
    TPStringFieldValidationErrorsCur extends TStringFieldValidationErrors,
  >(
    defaultErrors: TPStringFieldValidationErrorsCur,
  ): StringFieldValidationErrors<
    TPStringFieldDefinition,
    TPStringFieldValidationErrorsCur
  > {
    return new StringFieldValidationErrors({
      ...this.getCurrentConstructorOptions(),
      defaultErrors,
    });
  }

  toJSON() {
    return {
      ...super.toJSON(),
      fieldDefinition: this._fieldDefinition.toJSON(),
      defaultErrors: this._defaultErrors,
    };
  }

  clone(): StringFieldValidationErrors<
    TPStringFieldDefinition,
    TPStringFieldValidationErrors
  > {
    return new StringFieldValidationErrors(this.getCurrentConstructorOptions());
  }

  static getDefaultConstructorOptions(): OnlyWithTypeParameter<
    TStringFieldValidationErrorsOptions<
      TGStringFieldDefinition,
      TStringFieldValidationErrors
    >,
    boolean
  > {
    return {
      ...super.getDefaultConstructorOptions(),
    };
  }

  static minLength(field: string, minLength: number, message?: string): string {
    return (
      message ??
      formatStr(messages.FIELD.STRING.MIN_LENGTH, { field, minLength })
    );
  }

  static maxLength(field: string, maxLength: number, message?: string): string {
    return (
      message ??
      formatStr(messages.FIELD.STRING.MAX_LENGTH, { field, maxLength })
    );
  }

  static noSpaces(field: string, message?: string): string {
    return message ?? formatStr(messages.FIELD.STRING.NO_SPACE, { field });
  }

  static invalidEmail(field: string, message?: string): string {
    return message ?? formatStr(messages.FIELD.STRING.INVALID_EMAIL, { field });
  }

  build(): TStringFieldValidationErrors {
    const validations: TPStringFieldDefinition["validations"] =
      this._fieldDefinition.validations;

    return {
      ...super.build(),
      ...(typeof validations.minLength === "number" && {
        minLength: StringFieldValidationErrors.minLength(
          validations.field,
          validations.minLength,
          this._defaultErrors?.minLength,
        ),
      }),
      ...(typeof validations.maxLength === "number" && {
        maxLength: StringFieldValidationErrors.maxLength(
          validations.field,
          validations.maxLength,
          this._defaultErrors?.maxLength,
        ),
      }),
      ...(validations.isNoSpaces === true && {
        noSpaces: StringFieldValidationErrors.noSpaces(
          validations.field,
          this._defaultErrors?.noSpaces,
        ),
      }),
      ...(validations.isEmail === true && {
        invalidEmail: StringFieldValidationErrors.invalidEmail(
          validations.field,
          this._defaultErrors?.invalidEmail,
        ),
      }),
    };
  }
}

export class NumberFieldValidationErrors<
  TPNumberFieldDefinition extends TGNumberFieldDefintion,
  TPNumberFieldValidationErrors extends TNumberFieldValidationErrors,
> extends FieldValidationErrors<
  TPNumberFieldDefinition,
  TPNumberFieldValidationErrors
> {
  constructor(
    options: TNumberFieldValidationErrorsOptions<
      TPNumberFieldDefinition,
      TPNumberFieldValidationErrors
    >,
  ) {
    super({ ...options });
  }

  getCurrentConstructorOptions(): TNumberFieldValidationErrorsOptions<
    TPNumberFieldDefinition,
    TPNumberFieldValidationErrors
  > {
    return {
      ...super.getCurrentConstructorOptions(),
    };
  }

  setFieldDefinition<TPNumberFieldDefinitionCur extends TGNumberFieldDefintion>(
    fieldDefinition: TPNumberFieldDefinitionCur,
  ): NumberFieldValidationErrors<
    TPNumberFieldDefinitionCur,
    TPNumberFieldValidationErrors
  > {
    return new NumberFieldValidationErrors({
      ...this.getCurrentConstructorOptions(),
      fieldDefinition,
    });
  }

  setDefaultErrors<
    TPNumberFieldValidationErrorsCur extends TNumberFieldValidationErrors,
  >(
    defaultErrors: TPNumberFieldValidationErrorsCur,
  ): NumberFieldValidationErrors<
    TPNumberFieldDefinition,
    TPNumberFieldValidationErrorsCur
  > {
    return new NumberFieldValidationErrors({
      ...this.getCurrentConstructorOptions(),
      defaultErrors,
    });
  }

  toJSON() {
    return {
      ...super.toJSON(),
      fieldDefinition: this._fieldDefinition.toJSON(),
      defaultErrors: this._defaultErrors,
    };
  }

  clone(): NumberFieldValidationErrors<
    TPNumberFieldDefinition,
    TPNumberFieldValidationErrors
  > {
    return new NumberFieldValidationErrors(this.getCurrentConstructorOptions());
  }

  static getDefaultConstructorOptions(): OnlyWithTypeParameter<
    TNumberFieldValidationErrorsOptions<
      TGNumberFieldDefintion,
      TNumberFieldValidationErrors
    >,
    boolean
  > {
    return {
      ...super.getDefaultConstructorOptions(),
    };
  }

  static minValue(field: string, minValue: number, message?: string): string {
    return (
      message ?? formatStr(messages.FIELD.NUMBER.MIN_VALUE, { field, minValue })
    );
  }

  static maxValue(field: string, maxValue: number, message?: string): string {
    return (
      message ?? formatStr(messages.FIELD.NUMBER.MAX_VALUE, { field, maxValue })
    );
  }

  build(): TStringFieldValidationErrors {
    const validations: TPNumberFieldDefinition["validations"] =
      this._fieldDefinition.validations;

    return {
      ...super.build(),
      ...(typeof validations.minValue === "number" && {
        minValue: NumberFieldValidationErrors.minValue(
          validations.field,
          validations.minValue,
          this._defaultErrors?.minValue,
        ),
      }),
      ...(typeof validations.maxValue === "number" && {
        maxValue: NumberFieldValidationErrors.maxValue(
          validations.field,
          validations.maxValue,
          this._defaultErrors?.maxValue,
        ),
      }),
    };
  }
}

export class ArrayFieldValidationErrors<
  TPArrayFieldDefinition extends TGArrayFieldDefinition,
  TPArrayFieldValidationErrors extends TArrayFieldValidationErrors,
> extends FieldValidationErrors<
  TPArrayFieldDefinition,
  TPArrayFieldValidationErrors
> {
  constructor(
    options: TArrayFieldValidationErrorOptions<
      TPArrayFieldDefinition,
      TPArrayFieldValidationErrors
    >,
  ) {
    super({ ...options });
  }

  getCurrentConstructorOptions(): TArrayFieldValidationErrorOptions<
    TPArrayFieldDefinition,
    TPArrayFieldValidationErrors
  > {
    return {
      ...super.getCurrentConstructorOptions(),
    };
  }

  setFieldDefinition<TPArrayFieldDefinitionCur extends TGArrayFieldDefinition>(
    fieldDefinition: TPArrayFieldDefinitionCur,
  ): ArrayFieldValidationErrors<
    TPArrayFieldDefinitionCur,
    TPArrayFieldValidationErrors
  > {
    return new ArrayFieldValidationErrors({
      ...this.getCurrentConstructorOptions(),
      fieldDefinition,
    });
  }

  setDefaultErrors<
    TPArrayFieldValidationErrorsCur extends TArrayFieldValidationErrors,
  >(
    defaultErrors: TPArrayFieldValidationErrorsCur,
  ): ArrayFieldValidationErrors<
    TPArrayFieldDefinition,
    TPArrayFieldValidationErrorsCur
  > {
    return new ArrayFieldValidationErrors({
      ...this.getCurrentConstructorOptions(),
      defaultErrors,
    });
  }

  toJSON() {
    return {
      ...super.toJSON(),
      fieldDefinition: this._fieldDefinition.toJSON(),
      defaultErrors: this._defaultErrors,
    };
  }

  clone(): ArrayFieldValidationErrors<
    TPArrayFieldDefinition,
    TPArrayFieldValidationErrors
  > {
    return new ArrayFieldValidationErrors(this.getCurrentConstructorOptions());
  }

  static getDefaultConstructorOptions(): OnlyWithTypeParameter<
    TArrayFieldValidationErrorOptions<
      TGArrayFieldDefinition,
      TArrayFieldValidationErrors
    >,
    boolean
  > {
    return {
      ...super.getDefaultConstructorOptions(),
    };
  }

  static invalidLength(
    field: string,
    length: number,
    message?: string,
  ): string {
    return (
      message ??
      formatStr(messages.FIELD.ARRAY.INVALID_ARRAY_LENGTH, { field, length })
    );
  }

  static minLength(field: string, minLength: number, message?: string): string {
    return (
      message ??
      formatStr(messages.FIELD.ARRAY.ARRAY_MIN_LENGTH, { field, minLength })
    );
  }

  static maxLength(field: string, maxLength: number, message?: string): string {
    return (
      message ??
      formatStr(messages.FIELD.ARRAY.ARRAY_MAX_LENGTH, { field, maxLength })
    );
  }

  build(): TArrayFieldValidationErrors {
    const validations: TPArrayFieldDefinition["validations"] =
      this._fieldDefinition.validations;

    return {
      ...super.build(),
      ...(typeof validations.length === "number" && {
        invalidLength: ArrayFieldValidationErrors.invalidLength(
          validations.field,
          validations.length,
          this._defaultErrors?.invalidLength,
        ),
      }),
      ...(typeof validations.minLength === "number" && {
        minLength: ArrayFieldValidationErrors.minLength(
          validations.field,
          validations.minLength,
          this._defaultErrors?.minLength,
        ),
      }),
      ...(typeof validations.maxLength === "number" && {
        maxLength: ArrayFieldValidationErrors.maxLength(
          validations.field,
          validations.maxLength,
          this._defaultErrors?.maxLength,
        ),
      }),
    };
  }
}
