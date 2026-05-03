import UserMapper from "../utils/mappers/UserMapper.js";
import User, { type UserI } from "../models/User.js";
import UserDTO from "../utils/dto/User/UserDTO.js";

export default class UserService {
  getUserByEmail = async (email: string): Promise<UserDTO | null> => {
    const user: UserI | null = await User.findOne({ email }).exec().lean();
    return user ? new UserMapper().mapToDTO(user) : null;
  };

  getUserIdByEmail = async (email: string): Promise<string | null> => {};
}
