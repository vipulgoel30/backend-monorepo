// User imports
import { FieldTypes, OnlyWithTypeParameter } from "../types/types.ts";
import BaseClass from "./Base.ts";

interface TFieldValidationConstructorOptions<TPIsRequired extends boolean> {
  field: string;
  isRequired: TPIsRequired;
}

export interface TStringFieldValidationConstructorOptions<
  TPIsRequired extends boolean,
  TPIsNoSpaces extends boolean,
  TPIsEmail extends boolean,
> extends TFieldValidationConstructorOptions<TPIsRequired> {
  minLength?: number;
  maxLength?: number;
  isNoSpaces: TPIsNoSpaces;
  isEmail: TPIsEmail;
}

export interface TNumberFieldValidationConstructorOptions<
  TPIsRequired extends boolean,
> extends TFieldValidationConstructorOptions<TPIsRequired> {
  minValue?: number;
  maxValue?: number;
}

export interface TArrayFieldValidationConstructorOptions<
  TPIsRequired extends boolean,
> extends TFieldValidationConstructorOptions<TPIsRequired> {
  length?: number;
  minLength?: number;
  maxLength?: number;
}

export abstract class FieldValidations<
  TPIsRequired extends boolean,
> extends BaseClass {
  protected readonly _field: string;
  protected readonly _type: FieldTypes;
  protected readonly _isRequired: TPIsRequired;

  get field(): string {
    return this._field;
  }

  get type(): string {
    return this._type.toString();
  }

  get isRequired(): TPIsRequired {
    return this._isRequired;
  }

  constructor(
    fieldType: FieldTypes,
    options: TFieldValidationConstructorOptions<TPIsRequired>,
  ) {
    super();
    this._type = fieldType;
    this._field = options.field;
    this._isRequired = options.isRequired;
  }

  protected static getDefaultConstructorOptions(): OnlyWithTypeParameter<
    TFieldValidationConstructorOptions<false>,
    boolean
  > {
    return {
      isRequired: false,
    };
  }

  protected getCurrentConstructorOptions(): TFieldValidationConstructorOptions<TPIsRequired> {
    return {
      field: this._field,
      isRequired: this._isRequired,
    };
  }

  toJSON(): Record<string, any> {
    return {
      field: this._field,
      type: this._type,
      isRequired: this._isRequired,
    };
  }

  abstract setField(field: string): any;
  abstract setIsRequired<TPIsRequired extends boolean>(
    iseRquired: TPIsRequired,
  ): any;
}

export class StringFieldValidations<
  TPIsRequired extends boolean,
  TPIsNoSpaces extends boolean,
  TPIsEmail extends boolean,
> extends FieldValidations<TPIsRequired> {
  private readonly _minLength?: number;
  private readonly _maxLength?: number;
  private readonly _isNoSpaces: TPIsNoSpaces;
  private readonly _isEmail: TPIsEmail;

  get minLength(): number | undefined {
    return this._minLength;
  }

  get maxLength(): number | undefined {
    return this._maxLength;
  }

  get isNoSpaces(): TPIsNoSpaces {
    return this._isNoSpaces;
  }

  get isEmail(): TPIsEmail {
    return this._isEmail;
  }

  constructor(
    options: TStringFieldValidationConstructorOptions<
      TPIsRequired,
      TPIsNoSpaces,
      TPIsEmail
    >,
  ) {
    super(FieldTypes.string, {
      field: options.field,
      isRequired: options.isRequired,
    });
    this._minLength = options.minLength;
    this._maxLength = options.maxLength;
    this._isNoSpaces = options.isNoSpaces;
    this._isEmail = options.isEmail;
  }

  static getDefaultConstructorOptions(): OnlyWithTypeParameter<
    TStringFieldValidationConstructorOptions<false, false, false>,
    boolean
  > {
    return {
      ...super.getDefaultConstructorOptions(),
      isEmail: false,
      isNoSpaces: false,
      isRequired: false,
    };
  }

  protected getCurrentConstructorOptions(): TStringFieldValidationConstructorOptions<
    TPIsRequired,
    TPIsNoSpaces,
    TPIsEmail
  > {
    return {
      ...super.getCurrentConstructorOptions(),
      minLength: this._minLength,
      maxLength: this._maxLength,
      isEmail: this._isEmail,
      isNoSpaces: this._isNoSpaces,
    };
  }

  setField(
    field: string,
  ): StringFieldValidations<TPIsRequired, TPIsNoSpaces, TPIsEmail> {
    return new StringFieldValidations({
      ...this.getCurrentConstructorOptions(),
      field,
    });
  }

  setIsRequired<TPIsRequiredCur extends boolean>(
    isRequired: TPIsRequiredCur,
  ): StringFieldValidations<TPIsRequiredCur, TPIsNoSpaces, TPIsEmail> {
    return new StringFieldValidations({
      ...this.getCurrentConstructorOptions(),
      isRequired: isRequired,
    });
  }

  setMinLength(
    minLength: number | undefined,
  ): StringFieldValidations<TPIsRequired, TPIsNoSpaces, TPIsEmail> {
    return new StringFieldValidations({
      ...this.getCurrentConstructorOptions(),
      minLength,
    });
  }

  setMaxLength(
    maxLength: number | undefined,
  ): StringFieldValidations<TPIsRequired, TPIsNoSpaces, TPIsEmail> {
    return new StringFieldValidations({
      ...this.getCurrentConstructorOptions(),
      maxLength,
    });
  }

  setIsNoSpaces<TPIsNoSpacesCur extends boolean>(
    isNoSpaces: TPIsNoSpacesCur,
  ): StringFieldValidations<TPIsRequired, TPIsNoSpacesCur, TPIsEmail> {
    return new StringFieldValidations({
      ...this.getCurrentConstructorOptions(),
      isNoSpaces: isNoSpaces,
    });
  }

  setIsEmail<TPIsEmailCur extends boolean>(
    isEmail: TPIsEmailCur,
  ): StringFieldValidations<TPIsRequired, TPIsNoSpaces, TPIsEmailCur> {
    return new StringFieldValidations({
      ...this.getCurrentConstructorOptions(),
      isEmail: isEmail,
    });
  }

  clone(): StringFieldValidations<TPIsRequired, TPIsNoSpaces, TPIsEmail> {
    return new StringFieldValidations(this.getCurrentConstructorOptions());
  }

  toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      minLength: this._minLength,
      maxLength: this._maxLength,
      isNoSpaces: this._isNoSpaces,
      isEmail: this._isEmail,
    };
  }
}

export class NumberFieldValidations<
  TPIsRequired extends boolean,
> extends FieldValidations<TPIsRequired> {
  private readonly _minValue?: number;
  private readonly _maxValue?: number;

  get minValue(): number | undefined {
    return this._minValue;
  }

  get maxValue(): number | undefined {
    return this._maxValue;
  }

  constructor(options: TNumberFieldValidationConstructorOptions<TPIsRequired>) {
    super(FieldTypes.number, {
      field: options.field,
      isRequired: options.isRequired,
    });
    this._minValue = options.minValue;
    this._maxValue = options.maxValue;
  }

  static getDefaultConstructorOptions(): OnlyWithTypeParameter<
    TNumberFieldValidationConstructorOptions<false>,
    boolean
  > {
    return {
      ...super.getDefaultConstructorOptions(),
    };
  }

  protected getCurrentConstructorOptions(): TNumberFieldValidationConstructorOptions<TPIsRequired> {
    return {
      ...super.getCurrentConstructorOptions(),
      minValue: this._minValue,
      maxValue: this._maxValue,
    };
  }

  setField(field: string): NumberFieldValidations<TPIsRequired> {
    return new NumberFieldValidations({
      ...this.getCurrentConstructorOptions(),
      field,
    });
  }

  setIsRequired<TPRequiredCur extends boolean>(
    isRequired: TPRequiredCur,
  ): NumberFieldValidations<TPRequiredCur> {
    return new NumberFieldValidations({
      ...this.getCurrentConstructorOptions(),
      isRequired: isRequired,
    });
  }

  setMinValue(
    minValue: number | undefined,
  ): NumberFieldValidations<TPIsRequired> {
    return new NumberFieldValidations({
      ...this.getCurrentConstructorOptions(),
      minValue,
    });
  }

  setMaxValue(
    maxValue: number | undefined,
  ): NumberFieldValidations<TPIsRequired> {
    return new NumberFieldValidations({
      ...this.getCurrentConstructorOptions(),
      maxValue,
    });
  }

  clone(): NumberFieldValidations<TPIsRequired> {
    return new NumberFieldValidations(this.getCurrentConstructorOptions());
  }

  toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      minValue: this._minValue,
      maxValue: this._maxValue,
    };
  }
}

export class ArrayFieldValidations<
  TPIsRequired extends boolean,
> extends FieldValidations<TPIsRequired> {
  private readonly _length?: number;
  private readonly _minLength?: number;
  private readonly _maxLength?: number;

  constructor(options: TArrayFieldValidationConstructorOptions<TPIsRequired>) {
    super(FieldTypes.array, {
      field: options.field,
      isRequired: options.isRequired,
    });
    this._length = options.length;
    this._minLength = options.minLength;
    this._maxLength = options.maxLength;
  }

  get length(): number | undefined {
    return this._length;
  }

  get minLength(): number | undefined {
    return this._minLength;
  }

  get maxLength(): number | undefined {
    return this._maxLength;
  }

  protected getCurrentConstructorOptions(): TArrayFieldValidationConstructorOptions<TPIsRequired> {
    return {
      ...super.getCurrentConstructorOptions(),
      length: this._length,
      minLength: this._minLength,
      maxLength: this._maxLength,
    };
  }

  static getDefaultConstructorOptions(): OnlyWithTypeParameter<
    TArrayFieldValidationConstructorOptions<false>,
    boolean
  > {
    return {
      ...super.getDefaultConstructorOptions(),
    };
  }

  setField(field: string): ArrayFieldValidations<TPIsRequired> {
    return new ArrayFieldValidations({
      ...this.getCurrentConstructorOptions(),
      field,
    });
  }

  setIsRequired<TPIsRequiredCur extends boolean>(
    isRequired: TPIsRequiredCur,
  ): ArrayFieldValidations<TPIsRequiredCur> {
    return new ArrayFieldValidations({
      ...this.getCurrentConstructorOptions(),
      isRequired,
    });
  }

  setLength(length: number): ArrayFieldValidations<TPIsRequired> {
    return new ArrayFieldValidations({
      ...this.getCurrentConstructorOptions(),
      length,
    });
  }

  setMinLength(minLength: number): ArrayFieldValidations<TPIsRequired> {
    return new ArrayFieldValidations({
      ...this.getCurrentConstructorOptions(),
      minLength,
    });
  }

  setMaxLength(maxLength: number): ArrayFieldValidations<TPIsRequired> {
    return new ArrayFieldValidations({
      ...this.getCurrentConstructorOptions(),
      maxLength,
    });
  }

  clone(): ArrayFieldValidations<TPIsRequired> {
    return new ArrayFieldValidations(this.getCurrentConstructorOptions());
  }

  toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      length: this._length,
      minLength: this._minLength,
      maxLength: this._maxLength,
    };
  }
}

export type TGFieldValidations = FieldValidations<any>;
export type TGStringFieldValidations = StringFieldValidations<any, any, any>;
export type TGNumberFieldValidations = NumberFieldValidations<any>;
export type TGArrayFieldValidations = ArrayFieldValidations<any>;

export type TFieldValidationsUnion =
  | TGFieldValidations
  | TGStringFieldValidations
  | TGNumberFieldValidations
  | TGArrayFieldValidations;
