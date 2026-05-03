import { type UserI } from "../../models/User.js";
import UserDTO from "../dto/User/UserDTO.js";
import Mapper from "./Mapper.js";

export default class UserMapper extends Mapper<UserI, UserDTO> {
  mapToDTO(user: UserI): UserDTO {
    return new UserDTO(user.id, user.name, user.email, user.password, user.passwordLastModifiedAt, user.isVerified, user.createdAt, user.updatedAt);
  }
}
