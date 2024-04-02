import express from "express";

import users from "./users";
import auth from "./auth";
import subjects from "./subjects";
import classes from "./classes";
import classDetails from "./classDetails";

const router = express.Router();

export default (): express.Router => {
  auth(router);
  users(router);
  subjects(router);
  classes(router);
  classDetails(router);
  return router;
};
