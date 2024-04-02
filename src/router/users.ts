import express from "express";

import { UserController } from "../controllers/users";
import { authorizeAdmin, authorize } from "../middleware/authentication";
import { catchErrors } from "../middleware/exceptionHandler";

let controllers = new UserController();
let path = "/users";
let detailPath = "/users/:id";
export default (router: express.Router) => {
  router.get(
    path,
    authorizeAdmin,
    catchErrors(controllers.list.bind(controllers))
  );
  router.get(
    detailPath,
    authorizeAdmin,
    catchErrors(controllers.get.bind(controllers))
  );
  router.post(
    path,
    authorizeAdmin,
    catchErrors(catchErrors(controllers.create.bind(controllers)))
  );
  router.delete(
    detailPath,
    authorizeAdmin,
    catchErrors(catchErrors(controllers.delete.bind(controllers)))
  );
  router.patch(
    "/users/me",
    authorize,
    catchErrors(catchErrors(controllers.updateMe.bind(controllers)))
  );
  router.patch(
    detailPath,
    authorizeAdmin,
    catchErrors(catchErrors(controllers.update.bind(controllers)))
  );
};
