import express from "express";

import { authorizeAdmin, authorize } from "../middleware/authentication";
import { catchErrors } from "../middleware/exceptionHandler";
import { SubjectController } from "../controllers/subjects";

let controllers = new SubjectController();
let path = "/subjects";
let detailPath = path + "/:id";
export default (router: express.Router) => {
  router.get(path, authorize, catchErrors(controllers.list.bind(controllers)));
  router.get(
    detailPath,
    authorize,
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
    detailPath,
    authorizeAdmin,
    catchErrors(catchErrors(controllers.update.bind(controllers)))
  );
};
