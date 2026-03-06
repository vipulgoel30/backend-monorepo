export class CustomError<MetaType extends Record<string, any> = Record<string, any>> extends Error {
  constructor(
    message: string,
    public readonly prefix?: string,
    public readonly meta?: MetaType,
  ) {
    super(message);
  }
}
