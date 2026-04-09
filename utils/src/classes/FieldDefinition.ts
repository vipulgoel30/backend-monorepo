// User imports
import { FieldValidations, NumberFieldValidations, StringFieldValidations } from "./FieldValidations.ts";
import { FieldTransformations, NumberFieldTransformations, StringFieldTransformations } from "./FieldTransformations.ts";
import { CustomError, CustomErrorInfo } from "../errors/CustomError.ts";
import { utilsMessages as messages } from "./../config/messages.ts";
import { formatStr } from "../utils.ts";

class FieldDefinitionValidatorCustomError extends CustomError {
  constructor(message: string, info?: Omit<CustomErrorInfo, "scope">) {
    super(message, { ...info, scope: messages.INVALID_FIELD_DEFINITION.SCOPE });
  }
}

export abstract class FieldDefinition<TValidations extends FieldValidations<any>, TTransformations extends FieldTransformations> {
  protected _validations!: TValidations;
  protected _transformations!: TTransformations;
  protected _isAutoValidate: boolean = true;

  constructor(validations: TValidations, transformations: TTransformations, isAutoValidate: boolean = true) {
    this._validations = validations;
    this._transformations = transformations;
    this._isAutoValidate = isAutoValidate;
    if (this.isAutoValidate) this.validate();
  }

  private set validations(validations: TValidations) {
    this._validations = validations.clone();
    if (this._isAutoValidate) this.validate();
  }

  private set transformations(transformations: TTransformations) {
    this._transformations = transformations.clone();
    if (this._isAutoValidate) this.validate();
  }

  get validations(): Readonly<TValidations> {
    return this._validations;
  }

  get transformations(): Readonly<TTransformations> {
    return this._transformations;
  }

  get isAutoValidate(): boolean {
    return this._isAutoValidate;
  }

  abstract validate(): void;

  toJSON() {
    return {
      validations: this._validations.toJSON(),
      transformations: this._transformations.toJSON(),
    };
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }
}

export class StringFieldDefinition<
  TStringFieldValidation extends StringFieldValidations<any, any, any>,
  TStringFieldTranforamtions extends StringFieldTransformations<any, any, any>,
> extends FieldDefinition<TStringFieldValidation, TStringFieldTranforamtions> {
  constructor(validations: TStringFieldValidation, transformations: TStringFieldTranforamtions) {
    super(validations, transformations);
  }

  validate() {
    if (typeof this._validations.minLength === "number" && (!Number.isSafeInteger(this._validations.minLength) || this._validations.minLength < 0)) {
      throw new FieldDefinitionValidatorCustomError(formatStr(messages.INVALID_VALIDATIONS.MIN_LENGTH, { field: this._validations.field }), {
        meta: { definition: this },
      });
    }

    if (typeof this._validations.maxLength === "number" && (!Number.isSafeInteger(this._validations.maxLength) || this._validations.maxLength < 0)) {
      throw new FieldDefinitionValidatorCustomError(formatStr(messages.INVALID_VALIDATIONS.MAX_LENGTH, { field: this._validations.field }), { meta: { definition: this } });
    }

    if (typeof this._validations.minLength === "number" && typeof this._validations.maxLength === "number" && this._validations.minLength > this._validations.maxLength) {
      throw new FieldDefinitionValidatorCustomError(formatStr(messages.INVALID_VALIDATIONS.LENGTH_RANGE, { field: this._validations.field }), {
        meta: { definition: this },
      });
    }

    if (this._transformations.isToLowerCase === true && this._transformations.isToUpperCase === true) {
      throw new FieldDefinitionValidatorCustomError(formatStr(messages.INVALID_TRANFORMATIONS.CONFLICTING_CASE_TRANSFORM, { field: this._validations.field }), {
        meta: { definition: this },
      });
    }
  }
}

export class NumberFieldDefinition<
  TNumberFieldValidation extends NumberFieldValidations<any>,
  TNumberFieldTransformations extends NumberFieldTransformations<any>,
> extends FieldDefinition<TNumberFieldValidation, TNumberFieldTransformations> {
  constructor(validations: TNumberFieldValidation, transformations: TNumberFieldTransformations) {
    super(validations, transformations);
  }

  validate() {
    if (typeof this._validations.minValue === "number" && !Number.isFinite(this._validations.minValue)) {
      throw new FieldDefinitionValidatorCustomError(formatStr(messages.INVALID_VALIDATIONS.MIN_VALUE, { field: this._validations.field }), { meta: { definition: this } });
    }

    if (typeof this._validations.maxValue === "number" && !Number.isFinite(this._validations.maxValue)) {
      throw new FieldDefinitionValidatorCustomError(formatStr(messages.INVALID_VALIDATIONS.MAX_VALUE, { field: this._validations.field }), { meta: { definition: this } });
    }

    if (typeof this._validations.minValue === "number" && typeof this._validations.maxValue === "number" && this._validations.minValue > this._validations.maxValue) {
      throw new FieldDefinitionValidatorCustomError(formatStr(messages.INVALID_VALIDATIONS.MIN_MAX_VALUE_RANGE, { field: this._validations.field }), {
        meta: { definition: this },
      });
    }
  }
}

export type TFieldDefinitionsUnion = StringFieldDefinition<any, any> | NumberFieldDefinition<any, any>;
