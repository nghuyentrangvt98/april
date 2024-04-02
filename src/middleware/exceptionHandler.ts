import { NextFunction, Request, Response } from "express";

export const catchErrors =
  (action: any) => (req: Request, res: Response, next: NextFunction) =>
    action(req, res).catch(next);
