// User imports
import app from "./app.js";
import { createMongoUri, CustomError, formatErrMessage, formatStr, getErrMessage, isPortAsStr, mongoConnect, type CreateMongoUriConfig } from "@mono/utils";
import { retryAsync } from "./utils/utils.js";
import messages from "./config/messages.js";
import logger from "./utils/logger.js";

process.on("uncaughtException", (error) => {
  console.error(formatErrMessage("uncaughtException".toUpperCase(), error));
  process.exit(1);
});

process.on("unhandledRejection", (reason, _) => {
  console.error(formatErrMessage("unhandledRejection".toUpperCase(), reason));
  process.exit(1);
});

const initServer = async () => {
  try {
    // Connecting with MongoDb using mongoose connect()
    logger.info(messages.MONGO.CONNECT_INIT);

    const mongoConnectUriConfig: CreateMongoUriConfig = {
      hostname: process.env.MONGO_HOSTNAME,
      port: process.env.MONGO_PORT,
      username: process.env.MONGO_USERNAME,
      password: process.env.MONGO_PASSWORD,
      database: process.env.MONGO_DB,
    };

    const mongoConnectUri: string = createMongoUri(mongoConnectUriConfig);
    await mongoConnect(mongoConnectUri, retryAsync);

    logger.info(messages.MONGO.CONNECT_SUCCESS);

    // Starting listening for express application
    const serverPort: number = isPortAsStr(process.env.SERVER_PORT, "Configuration : Server port");
    const serverHostname: string = process.env.SERVER_HOSTNAME;

    app.listen(serverPort, serverHostname, () => {
      logger.info(formatStr(messages.INIT_SERVER.SUCCESS, { hostname: serverHostname, port: serverPort }));
    });
  } catch (error) {
    if (error instanceof CustomError) return logger.error(error.message, error.getInfo());
    logger.error(messages.INIT_SERVER.ERROR, { error: getErrMessage(error) });
  }
};

initServer();
