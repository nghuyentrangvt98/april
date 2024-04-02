import { RepositoryBase } from "./base";
import { IUser, UserModel } from "../schemas/users";

export class UserRepository extends RepositoryBase<IUser> {
  constructor() {
    super(UserModel);
  }
  async FindByEmail(email: string): Promise<IUser> {
    return await this.findOne({ email });
  }
}
