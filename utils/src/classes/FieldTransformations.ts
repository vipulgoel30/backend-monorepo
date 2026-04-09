export interface TFieldTransformationsConstructorOptions {}

export interface TStringFieldTransformationsConstructorOptions<
  TTrim extends boolean,
  TToLowerCase extends boolean,
  TToUpperCase extends boolean,
> extends TFieldTransformationsConstructorOptions {
  isTrim: TTrim;
  isToLowerCase: TToLowerCase;
  isToUpperCase: TToUpperCase;
}

export interface TNumberFieldTransformationsConstructorOptions<TCoerce extends boolean> extends TFieldTransformationsConstructorOptions {
  isCoerce: TCoerce;
}

export abstract class FieldTransformations {
  constructor() {}

  toJSON() {
    return {};
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }

  protected static getDefaultConstructorOptions(): TFieldTransformationsConstructorOptions {
    return {};
  }

  abstract clone(): any;
}

export class StringFieldTransformations<TTrim extends boolean, TToLowerCase extends boolean, TToUpperCase extends boolean> extends FieldTransformations {
  private _isTrim: TTrim;
  private _isToLowerCase: TToLowerCase;
  private _isToUpperCase: TToUpperCase;

  get isTrim() {
    return this._isTrim;
  }

  get isToLowerCase() {
    return this._isToLowerCase;
  }

  get isToUpperCase() {
    return this._isToUpperCase;
  }

  constructor(options: TStringFieldTransformationsConstructorOptions<TTrim, TToLowerCase, TToUpperCase>) {
    super();
    this._isTrim = options.isTrim;
    this._isToLowerCase = options.isToLowerCase;
    this._isToUpperCase = options.isToUpperCase;
  }

  static getDefaultConstructorOptions(): TStringFieldTransformationsConstructorOptions<false, false, false> {
    return {
      ...super.getDefaultConstructorOptions(),
      isTrim: false,
      isToLowerCase: false,
      isToUpperCase: false,
    };
  }

  private getCurrentConstructorOptions(): TStringFieldTransformationsConstructorOptions<TTrim, TToLowerCase, TToUpperCase> {
    return {
      isTrim: this._isTrim,
      isToLowerCase: this._isToLowerCase,
      isToUpperCase: this._isToUpperCase,
    };
  }

  setIsTrim<TTrimCur extends boolean>(isTrim: TTrimCur): StringFieldTransformations<TTrimCur, TToLowerCase, TToUpperCase> {
    return new StringFieldTransformations({
      ...this.getCurrentConstructorOptions(),
      isTrim,
    });
  }

  setIsToLowerCase<TToLowerCaseCur extends boolean>(isToLowerCase: TToLowerCaseCur): StringFieldTransformations<TTrim, TToLowerCaseCur, TToUpperCase> {
    return new StringFieldTransformations({
      ...this.getCurrentConstructorOptions(),
      isToLowerCase,
    });
  }
  setIsToUpperCase<TToUpperCaseCur extends boolean>(isToUpperCase: TToUpperCaseCur): StringFieldTransformations<TTrim, TToLowerCase, TToUpperCaseCur> {
    return new StringFieldTransformations({
      ...this.getCurrentConstructorOptions(),
      isToUpperCase,
    });
  }

  clone() {
    return new StringFieldTransformations({
      isTrim: this._isTrim,
      isToLowerCase: this._isToLowerCase,
      isToUpperCase: this._isToUpperCase,
    });
  }

  toJSON() {
    return {
      ...super.toJSON(),
      isTrim: this._isTrim,
      isToLowerCase: this._isToLowerCase,
      isToUpperCase: this._isToUpperCase,
    };
  }
}

export class NumberFieldTransformations<TCoerce extends boolean> extends FieldTransformations {
  private _isCoerce: TCoerce;

  get isCoerce() {
    return this._isCoerce;
  }

  constructor(options: TNumberFieldTransformationsConstructorOptions<TCoerce>) {
    super();
    this._isCoerce = options.isCoerce;
  }

  static getDefaultConstructorOptions(): TNumberFieldTransformationsConstructorOptions<false> {
    return {
      ...super.getDefaultConstructorOptions(),
      isCoerce: false,
    };
  }

  private getCurrentConstructorOptions(): TNumberFieldTransformationsConstructorOptions<TCoerce> {
    return {
      isCoerce: this._isCoerce,
    };
  }

  setIsCoerce<TCoerceCur extends boolean>(isCoerce: TCoerceCur): NumberFieldTransformations<TCoerceCur> {
    return new NumberFieldTransformations({
      ...this.getCurrentConstructorOptions(),
      isCoerce,
    });
  }

  clone() {
    return new NumberFieldTransformations({
      isCoerce: this._isCoerce,
    });
  }

  toJSON() {
    return {
      ...super.toJSON(),
      isCoerce: this._isCoerce,
    };
  }
}

export type TFieldTransformationsUnion = StringFieldTransformations<any, any, any> | NumberFieldTransformations<any>;
