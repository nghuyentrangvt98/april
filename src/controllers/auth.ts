import { Request, Response } from "express";
import { AuthenticationService } from "../service/authentication";
import { WrongUsernamePassword } from "../exc/auth";
import { getSignedUrl } from "../service/storage";

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
  const { user } = req.body;
  user.image = await getSignedUrl(user.image, 60);
  delete user["hashedPassword"];
  return res.status(200).json(user).end();
};
