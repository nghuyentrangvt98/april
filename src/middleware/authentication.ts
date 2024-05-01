import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../service/authentication";
import { UserRole } from "../schemas/enum";

const verifyAccessToken = async (req: Request): Promise<boolean> => {
  if (!req.headers.authorization) {
    return false;
  }

  const token: string = req.headers.authorization.split(" ")[1];
  try {
    const { credential, user } = await verifyJWT(token);
    if (credential) {
      req.app.locals.credential = credential;
      req.user = user;
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};

export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  if (await verifyAccessToken(req)) {
    return next();
  }
  return res.status(401).send({ error: "invalid token!" });
};

export const authorizeAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  if (await verifyAccessToken(req)) {
    if (req.user.role != UserRole.ADMIN) {
      return res.status(403).send({
        error: "not enough permission to perform this action!",
      });
    }
    return next();
  }
  return res.status(401).send({ error: "invalid token!" });
};

export const authorizeTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  if (await verifyAccessToken(req)) {
    if (![UserRole.TEACHER, UserRole.ADMIN].includes(req.user.role)) {
      return res.status(403).send({
        error: "not enough permission to perform this action!",
      });
    }
    return next();
  }
  return res.status(401).send({ error: "invalid token!" });
};
