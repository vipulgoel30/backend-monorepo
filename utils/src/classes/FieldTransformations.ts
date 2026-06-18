// User imports
import { OnlyWithTypeParameter } from "../types/types.ts";
import BaseClass from "./Base.ts";

interface TFieldTransformationsConstructorOptions {}

export interface TStringFieldTransformationsConstructorOptions<
  TPTrim extends boolean,
  TPIsToLowerCase extends boolean,
  TPIsToUpperCase extends boolean,
> extends TFieldTransformationsConstructorOptions {
  isTrim: TPTrim;
  isToLowerCase: TPIsToLowerCase;
  isToUpperCase: TPIsToUpperCase;
}

export interface TNumberFieldTransformationsConstructorOptions<
  TPIsCoerce extends boolean,
> extends TFieldTransformationsConstructorOptions {
  isCoerce: TPIsCoerce;
}

export interface TArrayFieldTranformationsConstructorOptions extends TFieldTransformationsConstructorOptions {}

export abstract class FieldTransformations extends BaseClass {
  constructor() {
    super();
  }

  toJSON(): Record<string, any> {
    return {};
  }

  protected static getDefaultConstructorOptions(): OnlyWithTypeParameter<
    TFieldTransformationsConstructorOptions,
    boolean
  > {
    return {};
  }

  protected getCurrentConstructorOptions(): TFieldTransformationsConstructorOptions {
    return {};
  }

  abstract clone(): any;
}

export class StringFieldTransformations<
  TPTrim extends boolean,
  TPIsToLowerCase extends boolean,
  TPIsToUpperCase extends boolean,
> extends FieldTransformations {
  private readonly _isTrim: TPTrim;
  private readonly _isToLowerCase: TPIsToLowerCase;
  private readonly _isToUpperCase: TPIsToUpperCase;

  get isTrim(): TPTrim {
    return this._isTrim;
  }

  get isToLowerCase(): TPIsToLowerCase {
    return this._isToLowerCase;
  }

  get isToUpperCase() {
    return this._isToUpperCase;
  }

  constructor(
    options: TStringFieldTransformationsConstructorOptions<
      TPTrim,
      TPIsToLowerCase,
      TPIsToUpperCase
    >,
  ) {
    super();
    this._isTrim = options.isTrim;
    this._isToLowerCase = options.isToLowerCase;
    this._isToUpperCase = options.isToUpperCase;
  }

  static getDefaultConstructorOptions(): OnlyWithTypeParameter<
    TStringFieldTransformationsConstructorOptions<false, false, false>,
    boolean
  > {
    return {
      ...super.getDefaultConstructorOptions(),
      isTrim: false,
      isToLowerCase: false,
      isToUpperCase: false,
    };
  }

  protected getCurrentConstructorOptions(): TStringFieldTransformationsConstructorOptions<
    TPTrim,
    TPIsToLowerCase,
    TPIsToUpperCase
  > {
    return {
      ...super.getCurrentConstructorOptions(),
      isTrim: this._isTrim,
      isToLowerCase: this._isToLowerCase,
      isToUpperCase: this._isToUpperCase,
    };
  }

  setIsTrim<TPTrimCur extends boolean>(
    isTrim: TPTrimCur,
  ): StringFieldTransformations<TPTrimCur, TPIsToLowerCase, TPIsToUpperCase> {
    return new StringFieldTransformations({
      ...this.getCurrentConstructorOptions(),
      isTrim,
    });
  }

  setIsToLowerCase<TPToLowerCaseCur extends boolean>(
    isToLowerCase: TPToLowerCaseCur,
  ): StringFieldTransformations<TPTrim, TPToLowerCaseCur, TPIsToUpperCase> {
    return new StringFieldTransformations({
      ...this.getCurrentConstructorOptions(),
      isToLowerCase,
    });
  }
  setIsToUpperCase<TPToUpperCaseCur extends boolean>(
    isToUpperCase: TPToUpperCaseCur,
  ): StringFieldTransformations<TPTrim, TPIsToLowerCase, TPToUpperCaseCur> {
    return new StringFieldTransformations({
      ...this.getCurrentConstructorOptions(),
      isToUpperCase,
    });
  }

  clone() {
    return new StringFieldTransformations(this.getCurrentConstructorOptions());
  }

  toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      isTrim: this._isTrim,
      isToLowerCase: this._isToLowerCase,
      isToUpperCase: this._isToUpperCase,
    };
  }
}

export class NumberFieldTransformations<
  TPIsCoerce extends boolean,
> extends FieldTransformations {
  private readonly _isCoerce: TPIsCoerce;

  get isCoerce(): TPIsCoerce {
    return this._isCoerce;
  }

  constructor(
    options: TNumberFieldTransformationsConstructorOptions<TPIsCoerce>,
  ) {
    super();
    this._isCoerce = options.isCoerce;
  }

  static getDefaultConstructorOptions(): OnlyWithTypeParameter<
    TNumberFieldTransformationsConstructorOptions<false>,
    boolean
  > {
    return {
      ...super.getDefaultConstructorOptions(),
      isCoerce: false,
    };
  }

  protected getCurrentConstructorOptions(): TNumberFieldTransformationsConstructorOptions<TPIsCoerce> {
    return {
      ...super.getCurrentConstructorOptions(),
      isCoerce: this._isCoerce,
    };
  }

  setIsCoerce<TCoerceCur extends boolean>(
    isCoerce: TCoerceCur,
  ): NumberFieldTransformations<TCoerceCur> {
    return new NumberFieldTransformations({
      ...this.getCurrentConstructorOptions(),
      isCoerce,
    });
  }

  clone() {
    return new NumberFieldTransformations(this.getCurrentConstructorOptions());
  }

  toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      isCoerce: this._isCoerce,
    };
  }
}

export class ArrayFieldTransformations extends FieldTransformations {
  constructor(options: TArrayFieldTranformationsConstructorOptions) {
    super();
  }

  static getDefaultConstructorOptions(): OnlyWithTypeParameter<
    TArrayFieldTranformationsConstructorOptions,
    boolean
  > {
    return {};
  }

  protected getCurrentConstructorOptions(): TArrayFieldTranformationsConstructorOptions {
    return {};
  }

  clone() {
    return new ArrayFieldTransformations(this.getCurrentConstructorOptions());
  }

  toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
    };
  }
}

export type TGFieldTransformations = FieldTransformations;
export type TGStringFieldTransformations = StringFieldTransformations<
  any,
  any,
  any
>;
export type TGNumberFieldTransformations = NumberFieldTransformations<any>;
export type TGArrayFieldTransformations = ArrayFieldTransformations;

export type TFieldTransformationsUnion =
  | TGStringFieldTransformations
  | TGNumberFieldTransformations
  | TGArrayFieldTransformations;
