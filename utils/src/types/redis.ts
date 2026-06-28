// Third party imports
import { type createClient } from "redis";

export enum EnumRedisStatus {
  SUCCESS,
  INVALID_DATA,
  ERROR,
  CLIENT_NOT_FOUND,
}

export interface TRedisCommandResponse<TData = any> {
  data: TData;
  status: EnumRedisStatus;
}

export interface TRedisConnectUrlConfig {
  username: string;
  password: string;
  hostname: string;
  port: string;
}

export type TRedisClient = Awaited<ReturnType<ReturnType<typeof createClient>["connect"]>>;

export interface TRedisCommandExpiryOptions {
  ex?: number;
  px?: number;
  exat?: number;
  pxat?: number;
  persist?: boolean;
}
