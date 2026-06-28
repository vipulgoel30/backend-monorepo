export interface TCustomErrorConstructorOptions {
  scope?: string;
  error?: any;
  meta?: any;
  context?: string[];
}

export class CustomError extends Error {
  public readonly scope?: string;
  public readonly error?: Error;
  public readonly meta?: any;
  public readonly context: string[];

  constructor(message: string, options?: TCustomErrorConstructorOptions) {
    super(message);
    this.scope = options?.scope;
    this.error = options?.error;
    this.meta = options?.meta;
    this.context = options?.context ?? [];

    // ensure the dispayed name is CustomError not Error
    this.name = this.constructor.name;

    // ensure that the prototype chain is correct (new CustomError() instanceof CustomError ==> returns true)
    Object.setPrototypeOf(this, new.target.prototype);

    // Removed the stack trace for the constructor
    // to remove extra line in stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  addContext(context: string): this {
    this.context.push(context);
    return this;
  }
}
