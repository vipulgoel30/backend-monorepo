import UserDTO from "../dto/UserDTO.js";
import User, { UserD, UserI } from "../../models/User.js";
import Mapper from "./Mapper.js";

export default class UserMapper extends Mapper<UserD, UserDTO> {
  mapToDTO(user: UserD): UserDTO {
    return new UserDTO(user.name, user.email, user.password, user.passwordLastModifiedAt, user.isVerified);
  }

  mapToEntity(user: UserDTO): UserD {
    return new User({
      name: user.name,
      email: user.email,
      password: user.password,
      passwordLastModifiedAt: user.passwordLastModifiedAt,
      isVerified: user.isVerified,
    });
  }
}
