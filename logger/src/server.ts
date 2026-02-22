// User imports
import app from "./app.js";
import { isPortAsStr, utilsMessages } from "@mono/utils";

const ERR_TYPES = ["uncaughtException", "unhandledRejection"] as const;
ERR_TYPES.forEach((errType: (typeof ERR_TYPES)[number]) => {
  process.on(errType, (error) => {
    console.error(`${errType.toUpperCase()} ${utilsMessages.ERROR}${error} `);
    process.exit(1);
  });
});

const initServer = async () => {
  try {
    const port: number = isPortAsStr(process.env.PORT, "Server condfiguration : port");
  } catch (err) {}
};

initServer();
