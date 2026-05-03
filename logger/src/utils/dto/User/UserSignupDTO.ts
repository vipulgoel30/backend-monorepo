export default class UserProtectcDTO {
  constructor(
    public readonly id: string,
    public isVerified: boolean,
    public passwordLastModifiedAt: Date,
    public readonly createdAt: Date,
  ) {}
}
