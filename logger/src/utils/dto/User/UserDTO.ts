// Third party imports
import type { Types } from "mongoose";

export default class UserDTO {
  constructor(
    public readonly id: Types.ObjectId,
    public name: string,
    public readonly email: string,
    public password: string,
    public passwordLastModifiedAt: Date,
    public isVerified: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
