// User imports
import { getErrMessage } from "../utils.ts";

export interface CustomErrorInfo<MetaType extends Record<string, any> = Record<string, any>> {
  scope?: string;
  error?: any;
  meta?: MetaType;
}

export class CustomError extends Error {
  constructor(
    message: string,
    public readonly info?: CustomErrorInfo,
  ) {
    super(message);
  }

  getInfo() {
    return {
      ...this.info?.meta,
      ...(this.info?.scope && { scope: this.info.scope }),
      ...(this.info?.error && { error: getErrMessage(this.info.error) }),
    };
  }
}
