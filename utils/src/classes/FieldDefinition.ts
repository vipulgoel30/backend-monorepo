// User imports
import {
  NumberFieldValidations,
  TGArrayFieldValidations,
  TGFieldValidations,
  TGNumberFieldValidations,
  TGStringFieldValidations,
} from "./FieldValidations.ts";
import {
  NumberFieldTransformations,
  TGArrayFieldTransformations,
  TGFieldTransformations,
  TGNumberFieldTransformations,
  TGStringFieldTransformations,
} from "./FieldTransformations.ts";
import {
  InternalError,
  type TInternalErrorInfo,
} from "../errors/InternalError.ts";
import { utilsMessages as messages } from "./../config/messages.ts";
import { formatStr } from "../utils.ts";
import { type TMetaType } from "../types/types.ts";
import BaseClass from "./Base.ts";

interface TFieldDefinitionConstructorOptions<
  TPFieldValidations extends TGFieldValidations,
  TPFieldTranformations extends TGFieldTransformations,
> {
  validations: TPFieldValidations;
  transformations: TPFieldTranformations;
}

export interface TStringFieldDefinitionConstructorOptions<
  TPFieldValidations extends TGStringFieldValidations,
  TPFieldTranformations extends TGStringFieldTransformations,
> extends TFieldDefinitionConstructorOptions<
  TPFieldValidations,
  TPFieldTranformations
> {}

export interface TNumberFieldDefinitionConstructorOptions<
  TPFieldValidations extends TGNumberFieldValidations,
  TPFieldTranformations extends TGNumberFieldTransformations,
> extends TFieldDefinitionConstructorOptions<
  TPFieldValidations,
  TPFieldTranformations
> {}

export interface TArrayFieldDefinitionConstructorOptions<
  TPFieldValidations extends TGArrayFieldValidations,
  TPFieldTranformations extends TGArrayFieldTransformations,
  TPArrayElementsFieldDefinition extends TFieldDefinitionsUnion,
> extends TFieldDefinitionConstructorOptions<
  TPFieldValidations,
  TPFieldTranformations
> {
  elementsFieldDefinition: TPArrayElementsFieldDefinition;
}

class FieldDefinitionInternalError<
  TPMetaType extends TMetaType,
> extends InternalError<TPMetaType> {
  constructor(
    message: string,
    info?: Omit<TInternalErrorInfo<TPMetaType>, "scope">,
  ) {
    super(message, { ...info, scope: messages.INVALID_FIELD_DEFINITION.SCOPE });
  }
}

export abstract class FieldDefinition<
  TPValidations extends TGFieldValidations,
  TPTransformations extends TGFieldTransformations,
> extends BaseClass {
  protected readonly _validations: TPValidations;
  protected readonly _transformations: TPTransformations;

  constructor(
    options: TFieldDefinitionConstructorOptions<
      TPValidations,
      TPTransformations
    >,
  ) {
    super();
    this._validations = options.validations;
    this._transformations = options.transformations;
    this.validate();
  }

  get validations(): TPValidations {
    return this._validations;
  }

  get transformations(): TPTransformations {
    return this._transformations;
  }

  getCurrentConstructorOptions(): TFieldDefinitionConstructorOptions<
    TPValidations,
    TPTransformations
  > {
    return {
      validations: this._validations,
      transformations: this._transformations,
    };
  }

  toJSON() {
    return {
      validations: this._validations.toJSON(),
      transformations: this._transformations.toJSON(),
    };
  }

  abstract validate(): void;
  abstract setValidations(...args: any): any;
  abstract setTransformations(...args: any[]): any;
}

export class StringFieldDefinition<
  TPStringFieldValidations extends TGStringFieldValidations,
  TPStringFieldTranforamtions extends TGStringFieldTransformations,
> extends FieldDefinition<
  TPStringFieldValidations,
  TPStringFieldTranforamtions
> {
  constructor(
    options: TStringFieldDefinitionConstructorOptions<
      TPStringFieldValidations,
      TPStringFieldTranforamtions
    >,
  ) {
    super(options);
  }

  setValidations<TPStringFieldValidationsCur extends TGStringFieldValidations>(
    validations: TPStringFieldValidationsCur,
  ): StringFieldDefinition<
    TPStringFieldValidationsCur,
    TPStringFieldTranforamtions
  > {
    return new StringFieldDefinition({
      ...this.getCurrentConstructorOptions(),
      validations,
    });
  }

  setTransformations<
    TPStringFieldTranforamtionsCur extends TGStringFieldTransformations,
  >(
    transformations: TPStringFieldTranforamtionsCur,
  ): StringFieldDefinition<
    TPStringFieldValidations,
    TPStringFieldTranforamtionsCur
  > {
    return new StringFieldDefinition({
      ...this.getCurrentConstructorOptions(),
      transformations,
    });
  }

  clone(): StringFieldDefinition<
    TPStringFieldValidations,
    TPStringFieldTranforamtions
  > {
    return new StringFieldDefinition(this.getCurrentConstructorOptions());
  }

  getCurrentConstructorOptions(): TStringFieldDefinitionConstructorOptions<
    TPStringFieldValidations,
    TPStringFieldTranforamtions
  > {
    return {
      ...super.getCurrentConstructorOptions(),
    };
  }

  toJSON() {
    return {
      ...super.toJSON(),
    };
  }

  validate() {
    if (
      typeof this._validations.minLength === "number" &&
      (!Number.isSafeInteger(this._validations.minLength) ||
        this._validations.minLength < 0)
    ) {
      throw new FieldDefinitionInternalError(
        formatStr(messages.INVALID_VALIDATIONS.STRING_MIN_LENGTH, {
          field: this._validations.field,
        }),
        {
          meta: { definition: this },
        },
      );
    }

    if (
      typeof this._validations.maxLength === "number" &&
      (!Number.isSafeInteger(this._validations.maxLength) ||
        this._validations.maxLength < 0)
    ) {
      throw new FieldDefinitionInternalError(
        formatStr(messages.INVALID_VALIDATIONS.STRING_MAX_LENGTH, {
          field: this._validations.field,
        }),
        { meta: { definition: this } },
      );
    }

    if (
      typeof this._validations.minLength === "number" &&
      typeof this._validations.maxLength === "number" &&
      this._validations.minLength > this._validations.maxLength
    ) {
      throw new FieldDefinitionInternalError(
        formatStr(messages.INVALID_VALIDATIONS.STRING_LENGTH_RANGE, {
          field: this._validations.field,
        }),
        {
          meta: { definition: this },
        },
      );
    }

    if (
      this._transformations.isToLowerCase === true &&
      this._transformations.isToUpperCase === true
    ) {
      throw new FieldDefinitionInternalError(
        formatStr(messages.INVALID_TRANFORMATIONS.CONFLICTING_CASE_TRANSFORM, {
          field: this._validations.field,
        }),
        {
          meta: { definition: this },
        },
      );
    }
  }
}

export class NumberFieldDefinition<
  TPNumberFieldValidations extends NumberFieldValidations<any>,
  TPNumberFieldTransformations extends NumberFieldTransformations<any>,
> extends FieldDefinition<
  TPNumberFieldValidations,
  TPNumberFieldTransformations
> {
  constructor(
    options: TNumberFieldDefinitionConstructorOptions<
      TPNumberFieldValidations,
      TPNumberFieldTransformations
    >,
  ) {
    super(options);
  }

  setValidations<TPNumberFieldValidationsCur extends TGNumberFieldValidations>(
    validations: TPNumberFieldValidationsCur,
  ): NumberFieldDefinition<
    TPNumberFieldValidationsCur,
    TPNumberFieldTransformations
  > {
    return new NumberFieldDefinition({
      ...this.getCurrentConstructorOptions(),
      validations,
    });
  }
  setTransformations<
    TPNumberFieldTransformationsCur extends TGNumberFieldTransformations,
  >(
    transformations: TPNumberFieldTransformationsCur,
  ): NumberFieldDefinition<
    TPNumberFieldValidations,
    TPNumberFieldTransformationsCur
  > {
    return new NumberFieldDefinition({
      ...this.getCurrentConstructorOptions(),
      transformations,
    });
  }

  clone(): NumberFieldDefinition<
    TPNumberFieldValidations,
    TPNumberFieldTransformations
  > {
    return new NumberFieldDefinition(this.getCurrentConstructorOptions());
  }

  getCurrentConstructorOptions(): TNumberFieldDefinitionConstructorOptions<
    TPNumberFieldValidations,
    TPNumberFieldTransformations
  > {
    return {
      ...super.getCurrentConstructorOptions(),
    };
  }

  toJSON() {
    return {
      ...super.toJSON(),
    };
  }

  validate() {
    if (
      typeof this._validations.minValue === "number" &&
      !Number.isFinite(this._validations.minValue)
    ) {
      throw new FieldDefinitionInternalError(
        formatStr(messages.INVALID_VALIDATIONS.NUMBER_MIN_VALUE, {
          field: this._validations.field,
        }),
        { meta: { definition: this } },
      );
    }

    if (
      typeof this._validations.maxValue === "number" &&
      !Number.isFinite(this._validations.maxValue)
    ) {
      throw new FieldDefinitionInternalError(
        formatStr(messages.INVALID_VALIDATIONS.NUMBER_MAX_VALUE, {
          field: this._validations.field,
        }),
        { meta: { definition: this } },
      );
    }

    if (
      typeof this._validations.minValue === "number" &&
      typeof this._validations.maxValue === "number" &&
      this._validations.minValue > this._validations.maxValue
    ) {
      throw new FieldDefinitionInternalError(
        formatStr(messages.INVALID_VALIDATIONS.NUMBER_MIN_MAX_VALUE_RANGE, {
          field: this._validations.field,
        }),
        {
          meta: { definition: this },
        },
      );
    }
  }
}

export class ArrayFieldDefinition<
  TPArrayFieldValidations extends TGArrayFieldValidations,
  TPArrayFieldTransformations extends TGArrayFieldTransformations,
  TPArrayElementsFieldDefinition extends TFieldDefinitionsUnion,
> extends FieldDefinition<
  TPArrayFieldValidations,
  TPArrayFieldTransformations
> {
  private readonly _elementsFieldDefinition: TPArrayElementsFieldDefinition;

  constructor(
    options: TArrayFieldDefinitionConstructorOptions<
      TPArrayFieldValidations,
      TPArrayFieldTransformations,
      TPArrayElementsFieldDefinition
    >,
  ) {
    super(options);
    this._elementsFieldDefinition = options.elementsFieldDefinition;
  }

  get elementsFieldDefinition(): TPArrayElementsFieldDefinition {
    return this._elementsFieldDefinition;
  }

  setValidations<TPArrayFieldValidationsCur extends TGArrayFieldValidations>(
    validations: TPArrayFieldValidationsCur,
  ): ArrayFieldDefinition<
    TPArrayFieldValidationsCur,
    TPArrayFieldTransformations,
    TPArrayElementsFieldDefinition
  > {
    return new ArrayFieldDefinition({
      ...this.getCurrentConstructorOptions(),
      validations,
    });
  }

  setTransformations<
    TPArrayFieldTransformationsCur extends TGArrayFieldTransformations,
  >(
    transformations: TPArrayFieldTransformationsCur,
  ): ArrayFieldDefinition<
    TPArrayFieldValidations,
    TPArrayFieldTransformationsCur,
    TPArrayElementsFieldDefinition
  > {
    return new ArrayFieldDefinition({
      ...this.getCurrentConstructorOptions(),
      transformations,
    });
  }

  setElementsFieldDefinition<
    TPArrayElementsFieldDefinitionCur extends TFieldDefinitionsUnion,
  >(
    elementsFieldDefinition: TPArrayElementsFieldDefinitionCur,
  ): ArrayFieldDefinition<
    TPArrayFieldValidations,
    TPArrayFieldTransformations,
    TPArrayElementsFieldDefinitionCur
  > {
    return new ArrayFieldDefinition({
      ...this.getCurrentConstructorOptions(),
      elementsFieldDefinition,
    });
  }

  clone() {
    return new ArrayFieldDefinition(this.getCurrentConstructorOptions());
  }

  getCurrentConstructorOptions(): TArrayFieldDefinitionConstructorOptions<
    TPArrayFieldValidations,
    TPArrayFieldTransformations,
    TPArrayElementsFieldDefinition
  > {
    return {
      ...super.getCurrentConstructorOptions(),
      elementsFieldDefinition: this._elementsFieldDefinition,
    };
  }

  validate() {
    if (
      typeof this._validations.length === "number" &&
      (typeof this._validations.minLength === "number" ||
        typeof this._validations.maxLength === "number")
    ) {
      throw new FieldDefinitionInternalError(
        formatStr(messages.INVALID_VALIDATIONS.ARRAY_LENGTH_WITH_MIN_MAX, {
          field: this._validations.field,
        }),
        {
          meta: { definition: this },
        },
      );
    } else if (
      typeof this._validations.minLength === "number" &&
      this._validations.minLength < 0
    ) {
      throw new FieldDefinitionInternalError(
        formatStr(messages.INVALID_VALIDATIONS.ARRAY_MIN_LENGTH, {
          field: this._validations.field,
        }),
        {
          meta: { definition: this },
        },
      );
    } else if (
      typeof this._validations.maxLength === "number" &&
      this._validations.maxLength < 0
    ) {
      throw new FieldDefinitionInternalError(
        formatStr(messages.INVALID_VALIDATIONS.ARRAY_MAX_LENGTH, {
          field: this._validations.field,
        }),
        {
          meta: { definition: this },
        },
      );
    } else if (
      typeof this._validations.minLength === "number" &&
      typeof this._validations.maxLength === "number" &&
      this._validations.minLength > this._validations.maxLength
    ) {
      throw new FieldDefinitionInternalError(
        formatStr(messages.INVALID_VALIDATIONS.ARRAY_LENGTH_RANGE, {
          field: this._validations.field,
        }),
        {
          meta: { definition: this },
        },
      );
    }
  }
}

export type TGFieldDefinition = FieldDefinition<
  TGFieldValidations,
  TGFieldTransformations
>;
export type TGStringFieldDefinition = StringFieldDefinition<
  TGStringFieldValidations,
  TGStringFieldTransformations
>;
export type TGNumberFieldDefintion = NumberFieldDefinition<
  TGNumberFieldValidations,
  TGNumberFieldTransformations
>;
export type TGArrayFieldDefinition = ArrayFieldDefinition<
  TGArrayFieldValidations,
  TGArrayFieldTransformations,
  TFieldDefinitionsUnion
>;

export type TFieldDefinitionsUnion =
  | TGStringFieldDefinition
  | TGNumberFieldDefintion
  | TGArrayFieldDefinition;
