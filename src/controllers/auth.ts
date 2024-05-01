import { Request, Response } from "express";
import { AuthenticationService } from "../service/authentication";
import { WrongUsernamePassword, InvalidEmail } from "../exc/auth";
import { getSignedUrl } from "../service/storage";
import { UserRepository } from "../repo/users";
import Authentication from "../utils/authentication";
import { sendMail } from "../service/mail";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = await new AuthenticationService().verifyUser(email, password);
  if (token === "") {
    throw new WrongUsernamePassword();
  }
  const accessToken = { type: "Bearer", accessToken: token };
  return res.status(200).json({
    status: "Ok!",
    message: "Successfully login!",
    result: accessToken,
  });
};

export const verify = async (req: Request, res: Response) => {
  const user = req.user;
  user.image = (await getSignedUrl(user.image, 60))[0];
  delete user["hashedPassword"];
  return res.status(200).json(user).end();
};

export const forgotPwd = async (req: Request, res: Response) => {
  const { email } = req.body;
  const userRepo = new UserRepository();
  const user = await userRepo.FindByEmail(email);
  if (!user) {
    throw new InvalidEmail();
  }
  const password = Math.random().toString(36).slice(3);
  const hashedPassword = await Authentication.hashPassword(password);
  await userRepo.update(user._id, { hashedPassword });
  sendMail(email, user.displayName, password);
  return res.status(200).json({
    status: "Ok!",
    message: "A new password has been sent to your email!",
  });
};
