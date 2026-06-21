export interface TCustomErrorInfo {
  scope?: string;
  error?: any;
  meta?: any;
}

export interface TCustomErrorConstructorOptions {
  info?: TCustomErrorInfo;
}

export type TCustomErrorConstructorOptionsWithoutScope =
  TCustomErrorConstructorOptions & { info?: Omit<TCustomErrorInfo, "scope"> };

export class CustomError extends Error {
  public readonly info;

  constructor(message: string, options?: TCustomErrorConstructorOptions) {
    super(message);
    if (options?.info) this.info = { ...options.info };

    // ensure the dispayed name is CustomError not Error
    this.name = this.constructor.name;

    // ensure that the prototype chain is correct (new CustomError() instanceof CustomError ==> returns true)
    Object.setPrototypeOf(this, new.target.prototype);

    // Removed the stack trace for the constructor
    // to remove extra line in stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
