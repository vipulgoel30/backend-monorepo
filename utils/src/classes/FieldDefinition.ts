// User imports
import { ArrayFieldValidations, FieldValidations, NumberFieldValidations, StringFieldValidations } from "./FieldValidations.ts";
import { ArrayFieldTransformations, FieldTransformations, NumberFieldTransformations, StringFieldTransformations } from "./FieldTransformations.ts";
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

  constructor(validations: TValidations, transformations: TTransformations, isAutoValidate: boolean) {
    this._validations = validations;
    this._transformations = transformations;
    this._isAutoValidate = isAutoValidate;
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
  constructor(validations: TStringFieldValidation, transformations: TStringFieldTranforamtions, isAutoValidate: boolean = true) {
    super(validations, transformations, isAutoValidate);
  }

  validate() {
    if (typeof this._validations.minLength === "number" && (!Number.isSafeInteger(this._validations.minLength) || this._validations.minLength < 0)) {
      throw new FieldDefinitionValidatorCustomError(formatStr(messages.INVALID_VALIDATIONS.STRING_MIN_LENGTH, { field: this._validations.field }), {
        meta: { definition: this },
      });
    }

    if (typeof this._validations.maxLength === "number" && (!Number.isSafeInteger(this._validations.maxLength) || this._validations.maxLength < 0)) {
      throw new FieldDefinitionValidatorCustomError(formatStr(messages.INVALID_VALIDATIONS.STRING_MAX_LENGTH, { field: this._validations.field }), { meta: { definition: this } });
    }

    if (typeof this._validations.minLength === "number" && typeof this._validations.maxLength === "number" && this._validations.minLength > this._validations.maxLength) {
      throw new FieldDefinitionValidatorCustomError(formatStr(messages.INVALID_VALIDATIONS.STRING_LENGTH_RANGE, { field: this._validations.field }), {
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
  constructor(validations: TNumberFieldValidation, transformations: TNumberFieldTransformations, isAutoValidate: boolean = true) {
    super(validations, transformations, isAutoValidate);
  }

  validate() {
    if (typeof this._validations.minValue === "number" && !Number.isFinite(this._validations.minValue)) {
      throw new FieldDefinitionValidatorCustomError(formatStr(messages.INVALID_VALIDATIONS.NUMBER_MIN_VALUE, { field: this._validations.field }), { meta: { definition: this } });
    }

    if (typeof this._validations.maxValue === "number" && !Number.isFinite(this._validations.maxValue)) {
      throw new FieldDefinitionValidatorCustomError(formatStr(messages.INVALID_VALIDATIONS.NUMBER_MAX_VALUE, { field: this._validations.field }), { meta: { definition: this } });
    }

    if (typeof this._validations.minValue === "number" && typeof this._validations.maxValue === "number" && this._validations.minValue > this._validations.maxValue) {
      throw new FieldDefinitionValidatorCustomError(formatStr(messages.INVALID_VALIDATIONS.NUMBER_MIN_MAX_VALUE_RANGE, { field: this._validations.field }), {
        meta: { definition: this },
      });
    }
  }
}

export class ArrayFieldDefinition<
  TArrayFieldValidation extends ArrayFieldValidations<any>,
  TArrayFieldTransformations extends ArrayFieldTransformations,
  TArrayElementsFieldDefinition extends TFieldDefinitionsUnion,
> extends FieldDefinition<TArrayFieldValidation, TArrayFieldTransformations> {
  private _elementsFieldDefinition: TArrayElementsFieldDefinition;

  constructor(
    validations: TArrayFieldValidation,
    transformations: TArrayFieldTransformations,
    elementsFieldDefinition: TArrayElementsFieldDefinition,
    isAutoValidate: boolean = true,
  ) {
    super(validations, transformations, isAutoValidate);
    this._elementsFieldDefinition = elementsFieldDefinition;
  }

  validate() {
    if (typeof this._validations.length === "number" && (typeof this._validations.minLength === "number" || typeof this._validations.maxLength === "number")) {
      throw new FieldDefinitionValidatorCustomError(formatStr(messages.INVALID_VALIDATIONS.ARRAY_LENGTH_WITH_MIN_MAX, { field: this._validations.field }), {
        meta: { definition: this },
      });
    } else if (typeof this._validations.minLength === "number" && this._validations.minLength < 0) {
      throw new FieldDefinitionValidatorCustomError(formatStr(messages.INVALID_VALIDATIONS.ARRAY_MIN_LENGTH, { field: this._validations.field }), {
        meta: { definition: this },
      });
    } else if (typeof this._validations.maxLength === "number" && this._validations.maxLength < 0) {
      throw new FieldDefinitionValidatorCustomError(formatStr(messages.INVALID_VALIDATIONS.ARRAY_MAX_LENGTH, { field: this._validations.field }), {
        meta: { definition: this },
      });
    } else if (typeof this._validations.minLength === "number" && typeof this._validations.maxLength === "number" && this._validations.minLength > this._validations.maxLength) {
      throw new FieldDefinitionValidatorCustomError(formatStr(messages.INVALID_VALIDATIONS.ARRAY_LENGTH_RANGE, { field: this._validations.field }), {
        meta: { definition: this },
      });
    }

    // Validating elements of array field definition
    this._elementsFieldDefinition.validate();
  }
}

export type TFieldDefinitionsUnion = StringFieldDefinition<any, any> | NumberFieldDefinition<any, any>;
