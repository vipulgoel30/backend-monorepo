export default class UserDTO {
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public passwordLastModifiedAt: Date,
    public isVerified: boolean,
  ) {}
}
