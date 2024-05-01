import express from "express";

import { UserController } from "../controllers/users";
import {
  authorizeAdmin,
  authorize,
  authorizeTeacher,
} from "../middleware/authentication";
import multer from "multer";
import { catchErrors } from "../middleware/exceptionHandler";
const upload = multer({
  storage: multer.memoryStorage(),
});

let controllers = new UserController();
let path = "/users";
let detailPath = "/users/:id";
export default (router: express.Router) => {
  router.get(
    path,
    authorizeTeacher,
    catchErrors(controllers.list.bind(controllers))
  );
  router.get(
    detailPath,
    authorizeTeacher,
    catchErrors(controllers.get.bind(controllers))
  );
  router.post(
    path,
    authorizeAdmin,
    catchErrors(controllers.create.bind(controllers))
  );
  router.delete(
    detailPath,
    authorizeAdmin,
    catchErrors(controllers.delete.bind(controllers))
  );
  router.patch(
    "/users/me",
    authorize,
    catchErrors(controllers.updateMe.bind(controllers))
  );
  router.patch(
    "/users/me/image",
    authorize,
    upload.single("file"),
    catchErrors(controllers.updateImage.bind(controllers))
  );
  router.patch(
    detailPath,
    authorizeAdmin,
    catchErrors(controllers.update.bind(controllers))
  );
};
