import { FieldTypes } from "../types.ts";

export interface TFieldValidationConstructorOptions<TRequired extends boolean> {
  isRequired: TRequired;
}

export interface TStringFieldValidationConstructorOptions<
  TRequired extends boolean,
  TNoSpaces extends boolean,
  TEmail extends boolean,
> extends TFieldValidationConstructorOptions<TRequired> {
  minLength?: number;
  maxLength?: number;
  isNoSpaces: TNoSpaces;
  isEmail: TEmail;
}

export interface TNumberFieldValidationConstructorOptions<TRequired extends boolean> extends TFieldValidationConstructorOptions<TRequired> {
  minValue?: number;
  maxValue?: number;
}

export abstract class FieldValidations<TRequired extends boolean = any> {
  protected _field: string;
  protected readonly _type: FieldTypes;
  protected _isRequired: TRequired;

  get field(): string {
    return this._field;
  }

  get type(): FieldTypes {
    return this._type;
  }

  get isRequired(): TRequired {
    return this._isRequired;
  }

  constructor(field: string, type: FieldTypes, options: TFieldValidationConstructorOptions<TRequired>) {
    this._field = field;
    this._type = type;
    this._isRequired = options.isRequired;
  }

  protected static getDefaultConstructorOptions(): TFieldValidationConstructorOptions<false> {
    return {
      isRequired: false,
    };
  }

  protected getCurrentConstructorOptions(): TFieldValidationConstructorOptions<TRequired> {
    return {
      isRequired: this._isRequired,
    };
  }

  toJSON() {
    return {
      field: this._field,
      type: this._type,
      isRequired: this._isRequired,
    };
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }

  abstract setField(field: string): any;
  abstract setIsRequired<TRequired extends boolean>(iseRquired: TRequired): any;
  abstract clone(): any;
}

export class StringFieldValidations<TRequired extends boolean = any, TNoSpaces extends boolean = any, TEmail extends boolean = any> extends FieldValidations<TRequired> {
  private _minLength?: number;
  private _maxLength?: number;
  private _isNoSpaces: TNoSpaces;
  private _isEmail: TEmail;

  get minLength(): number | undefined {
    return this._minLength;
  }

  get maxLength(): number | undefined {
    return this._maxLength;
  }

  get isNoSpaces(): TNoSpaces {
    return this._isNoSpaces;
  }

  get isEmail(): TEmail {
    return this._isEmail;
  }

  constructor(field: string, options: TStringFieldValidationConstructorOptions<TRequired, TNoSpaces, TEmail>) {
    super(field, FieldTypes.string, { isRequired: options.isRequired });
    this._minLength = options.minLength;
    this._maxLength = options.maxLength;
    this._isNoSpaces = options.isNoSpaces;
    this._isEmail = options.isEmail;
  }

  static getDefaultConstructorOptions(): TStringFieldValidationConstructorOptions<false, false, false> {
    return {
      ...super.getDefaultConstructorOptions(),
      minLength: undefined,
      maxLength: undefined,
      isEmail: false,
      isNoSpaces: false,
    };
  }

  protected getCurrentConstructorOptions(): TStringFieldValidationConstructorOptions<TRequired, TNoSpaces, TEmail> {
    return {
      ...super.getCurrentConstructorOptions(),
      minLength: this._minLength,
      maxLength: this._maxLength,
      isEmail: this._isEmail,
      isNoSpaces: this._isNoSpaces,
    };
  }

  setField(field: string): StringFieldValidations<TRequired, TNoSpaces, TEmail> {
    return new StringFieldValidations(field, { ...this.getCurrentConstructorOptions() });
  }

  setIsRequired<TRequiredCur extends boolean>(isRequired: TRequiredCur): StringFieldValidations<TRequiredCur, TNoSpaces, TEmail> {
    return new StringFieldValidations(this._field, {
      ...this.getCurrentConstructorOptions(),
      isRequired: isRequired,
    });
  }

  setMinLength(minLength: number | undefined): StringFieldValidations<TRequired, TNoSpaces, TEmail> {
    return new StringFieldValidations(this._field, { ...this.getCurrentConstructorOptions(), minLength });
  }

  setMaxLength(maxLength: number | undefined): StringFieldValidations<TRequired, TNoSpaces, TEmail> {
    return new StringFieldValidations(this._field, { ...this.getCurrentConstructorOptions(), maxLength });
  }

  setIsNoSpaces<TNoSpacesCur extends boolean>(isNoSpaces: TNoSpacesCur): StringFieldValidations<TRequired, TNoSpacesCur, TEmail> {
    return new StringFieldValidations(this._field, {
      ...this.getCurrentConstructorOptions(),
      isNoSpaces: isNoSpaces,
    });
  }

  setIsEmail<TEmailCur extends boolean>(isEmail: TEmailCur): StringFieldValidations<TRequired, TNoSpaces, TEmailCur> {
    return new StringFieldValidations(this._field, {
      ...this.getCurrentConstructorOptions(),
      isEmail: isEmail,
    });
  }

  clone(): StringFieldValidations<TRequired, TNoSpaces, TEmail> {
    return new StringFieldValidations(this._field, this.getCurrentConstructorOptions());
  }

  toJSON() {
    return {
      ...super.toJSON(),
      minLength: this._minLength,
      maxLength: this._maxLength,
      isNoSpaces: this._isNoSpaces,
      isEmail: this._isEmail,
    };
  }
}

export class NumberFieldValidations<TRequired extends boolean = any> extends FieldValidations<TRequired> {
  private _minValue?: number;
  private _maxValue?: number;

  get minValue() {
    return this._minValue;
  }

  get maxValue() {
    return this._maxValue;
  }

  constructor(field: string, options: TNumberFieldValidationConstructorOptions<TRequired>) {
    super(field, FieldTypes.number, { isRequired: options.isRequired });
    if (typeof options?.minValue === "number") this._minValue = options.minValue;
    if (typeof options?.maxValue === "number") this._maxValue = options.maxValue;
  }

  static getDefaultConstructorOptions(): TNumberFieldValidationConstructorOptions<false> {
    return {
      ...super.getDefaultConstructorOptions(),
      minValue: undefined,
      maxValue: undefined,
    };
  }

  protected getCurrentConstructorOptions(): TNumberFieldValidationConstructorOptions<TRequired> {
    return {
      ...super.getCurrentConstructorOptions(),
      minValue: this._minValue,
      maxValue: this._maxValue,
    };
  }

  setField(field: string): NumberFieldValidations<TRequired> {
    return new NumberFieldValidations(field, { ...this.getCurrentConstructorOptions() });
  }

  setIsRequired<TRequiredCur extends boolean>(isRequired: TRequiredCur): NumberFieldValidations<TRequiredCur> {
    return new NumberFieldValidations(this._field, {
      ...this.getCurrentConstructorOptions(),
      isRequired: isRequired,
    });
  }

  setMinValue(minValue: number | undefined): NumberFieldValidations<TRequired> {
    return new NumberFieldValidations(this._field, { ...this.getCurrentConstructorOptions(), minValue });
  }

  setMaxValue(maxValue: number | undefined): NumberFieldValidations<TRequired> {
    return new NumberFieldValidations(this._field, { ...this.getCurrentConstructorOptions(), maxValue });
  }

  clone(): NumberFieldValidations<TRequired> {
    return new NumberFieldValidations(this._field, this.getCurrentConstructorOptions());
  }

  toJSON() {
    return {
      ...super.toJSON(),
      minValue: this._minValue,
      maxValue: this._maxValue,
    };
  }
}

export type TFieldValidationsUnion = StringFieldValidations<any, any, any> | NumberFieldValidations<any>;
