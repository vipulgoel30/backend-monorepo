export class CustomError<MetaType> extends Error {
  constructor(
    message: string,
    public readonly meta?: MetaType,
  ) {
    super(message);
  }
}
