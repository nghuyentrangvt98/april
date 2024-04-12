import express from "express";

import { login, verify, forgotPwd } from "../controllers/auth";
import { authorize } from "../middleware/authentication";
import { catchErrors } from "../middleware/exceptionHandler";

export default (router: express.Router) => {
  router.post("/auth/login", catchErrors(login));
  router.post("/auth/verify", authorize, catchErrors(verify));
  router.post("/auth/forgot-password", catchErrors(forgotPwd));
};
