// Third party imports
import { connect, type ConnectOptions } from "mongoose";
import { type retryAsyncWrapper } from "../retryAsync.ts";

export const mongoConnect = async (
  uri: string,
  retryAsync: ReturnType<typeof retryAsyncWrapper>,
  options?: ConnectOptions,
) => {
  const mongoose = await retryAsync(() => connect(uri, options));
  mongoose.connection.on("error", (err) => {});
};
