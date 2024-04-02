import Authentication from "../utils/authentication";
import jwt from "jsonwebtoken";
import { secretKey } from "../setting";
import { UserRepository } from "../repo/users";

interface IAuthenticationService {
  verifyUser(email: string, password: string): Promise<string>;
}

export class AuthenticationService implements IAuthenticationService {
  async verifyUser(email: string, password: string): Promise<string> {
    const userRepo = new UserRepository();
    const user = await userRepo.FindByEmail(email);

    if (!user) {
      throw new Error("wrong email or password");
    }
    // check password
    let compare = await Authentication.verifyPassword(
      password,
      user.hashedPassword
    );

    // generate token
    if (compare) {
      return Authentication.generateToken(user._id);
    }
    return "";
  }
}

export const verifyJWT = async (token: string): Promise<any> => {
  const credential: any = jwt.verify(token, secretKey);
  if (credential) {
    const userRepo = new UserRepository();
    const user = await userRepo.findById(credential.userId);
    return {
      user: user,
      credential: credential,
    };
  }
  return null;
};
