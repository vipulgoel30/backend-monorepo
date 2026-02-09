// Third party imports
import { createLogger, transports, format, config } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// User imports
import { formatStr } from "@mono/utils";
import messages from "../config/messages.js";
import settings from "../config/settings.js";

const { combine, timestamp, colorize, errors, json } = format;

const allowedLevels = Object.keys(config.npm.levels);

// Checking if the level provided in .env
// is valid log level or not
const level = process.env.LOG_LEVEL?.trim();
if (typeof level !== "string" || !allowedLevels.includes(level)) {
  throw new Error(formatStr(messages.INVALID_LOG_LEVEL, { level, allowedLevels: allowedLevels.join(", ") }));
}

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

const logger = createLogger({
  level,
  transports: [fileTransport],
});

// For development environment
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: combine(timestamp(), colorize({ level: true })),
    }),
  );
}
