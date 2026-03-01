// User imports
import { utilsSettings as settings } from "../config/settings.ts";

const defaultRetryAsyncOptions = {
  defaultRetries: settings.RETRY.COUNT,
  defaultInterval: settings.RETRY.INTERVAL,
  defaultMaxInterval: settings.RETRY.MAX_INTERVAL,
};

const retryAsync = async <T = any>(
  operation: () => Promise<T>,
  retries: number,
  interval: number,
  maxInterval: number,
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 1) throw error;

    await new Promise((resolve) => setTimeout(resolve, interval));
    const delay = Math.min(interval * 2, maxInterval); // back off delay

    return retryAsync(operation, retries - 1, delay, maxInterval);
  }
};

const retryAsyncWrapper =
  (options = defaultRetryAsyncOptions) =>
  async <T = any>(
    operation: () => Promise<T>,
    retries = options.defaultRetries,
    interval = options.defaultInterval,
    maxInterval = options.defaultMaxInterval,
  ): Promise<T> =>
    retryAsync(operation, retries, interval, maxInterval);

export { retryAsyncWrapper };
