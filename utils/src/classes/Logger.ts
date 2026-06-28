import { config } from "winston";

export type TLogger = {
  [Key in keyof config.NpmConfigSetLevels]: (message: string, ...meta: any[]) => void;
};

export class Logger {
  private static _logger: TLogger | null;

  static set logger(logger: TLogger) {
    this._logger = logger;
  }

  static get logger(): TLogger | null {
    return this._logger;
  }
}
