import UserDTO from "../utils/dto/UserDTO.js";
import UserMapper from "../utils/mappers/UserMapper.js";
import User, { UserD, UserI } from "../models/User.js";

export default class UserService {
  getUserByEmail = async (email: string): Promise<UserDTO | null> => {
    const user = await User.findOne({ email }).lean();
    type test = typeof user;

    return user ? new UserMapper().mapToDTO(user) : null;
  };
}
