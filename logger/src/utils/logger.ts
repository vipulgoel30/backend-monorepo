import { createLogger, transport, transports} from "winston";
import DailyRotateFile from "winston-daily-rotate-file";


const level = process.env.


const fileTransport = new DailyRotateFile({
    level:
})


const logger = createLogger({
  transports: [new transports.File()],
});
