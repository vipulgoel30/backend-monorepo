import app from "./app.js";
import { connect } from "mongoose";
import { utilsMessages } from "@mono/utils";
import { isPort } from "validator";

const ERR_TYPES = ["uncaughtException", "unhandledRejection"] as const;
ERR_TYPES.forEach((errType: (typeof ERR_TYPES)[number]) => {
  process.on(errType, (error) => {
    console.error(`${errType.toUpperCase()} ${utilsMessages.ERROR}${error} `);
    process.exit(1);
  });
});

const initServer = async () => {
  try {
    const port = process.env.PORT;
    if (!isPort(port)) {
    }
  } catch (err) {
    
  }
};

initServer();
