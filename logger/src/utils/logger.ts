// Core imports
import { basename } from "path";

// Third party imports
import { createLogger, transports, format, config } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// User imports
import { formatStr, type Logger } from "@mono/utils";
import messages from "../config/messages.js";
import settings from "../config/settings.js";

const { combine, timestamp, colorize, json } = format;

const allowedLevels = Object.keys(config.npm.levels);

// Checking if the level provided in .env
// is valid log level or not
const level = process.env.LOG_LEVEL?.trim();
if (typeof level !== "string" || !allowedLevels.includes(level)) {
  throw new Error(formatStr(messages.LOG.INVALID_LEVEL, { level, allowedLevels: allowedLevels.join(", ") }));
}

const getCallerInfo = (): { scope: string; functionName: string; lineNo: string } => {
  let scope: string = messages.LOG.ERR_EXTRACT_CALLER_INFO;
  let lineNo: string = messages.LOG.ERR_EXTRACT_CALLER_INFO;
  let functionName: string = messages.LOG.ERR_EXTRACT_CALLER_INFO;

  try {
    const error = new Error();
    Error.captureStackTrace(error);
    const stack: string | undefined = error.stack?.split("\n")?.[3];

    if (stack) {
      const matches: RegExpMatchArray | null = stack.match(/at (.+ )?\((.+):(\d+):(\d+)\)/);
      if (matches) {
        functionName = matches[1];
        lineNo = matches[3];
        scope = basename(matches[2]);
      }
    }
  } catch (error) {
    console.warn(error);
  }

  return { scope, functionName, lineNo };
};

const fileTransport = new DailyRotateFile({
  datePattern: settings.LOG.ROTATE.DATE_PATTERN,
  zippedArchive: settings.LOG.ROTATE.ZIP_ARCHIEVE,
  filename: settings.LOG.ROTATE.FILENAME,
  dirname: settings.LOG.ROTATE.DIRNAME,
  maxSize: settings.LOG.ROTATE.MAX_SIZE,
  maxFiles: settings.LOG.ROTATE.MAX_FILES,
  extension: settings.LOG.ROTATE.EXTENSION,
  format: combine(timestamp(), json()),
});

const winstonLogger = createLogger({
  level,
  transports: [fileTransport],
});

// For development environment
if (process.env.NODE_ENV !== "production") {
  winstonLogger.add(
    new transports.Console({
      format: combine(timestamp(), json()),
    }),
  );
}

export default {
  error: (message: string, ...meta: any[]) => {
    winstonLogger.error(message, { ...meta, ...getCallerInfo() });
  },
  info: (message: string, ...meta: any[]) => {
    winstonLogger.info(message, { ...meta, ...getCallerInfo() });
  },
  warn: (message: string, ...meta: any[]) => {
    winstonLogger.warn(message, { ...meta, ...getCallerInfo() });
  },
  http: (message: string, ...meta: any[]) => {
    winstonLogger.http(message, { ...meta, ...getCallerInfo() });
  },
  verbose: (message: string, ...meta: any[]) => {
    winstonLogger.verbose(message, { ...meta, ...getCallerInfo() });
  },
  debug: (message: string, ...meta: any[]) => {
    winstonLogger.debug(message, { ...meta, ...getCallerInfo() });
  },
  silly: (message: string, ...meta: any[]) => {
    winstonLogger.silly(message, { ...meta, ...getCallerInfo() });
  },
} satisfies Logger;
