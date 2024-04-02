import express from "express";

import { authorizeTeacher } from "../middleware/authentication";
import { catchErrors } from "../middleware/exceptionHandler";
import { ClassController } from "../controllers/classes";

let controllers = new ClassController();
let path = "/classes";
let detailPath = path + "/:id";
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
    authorizeTeacher,
    catchErrors(catchErrors(controllers.create.bind(controllers)))
  );
  router.delete(
    detailPath,
    authorizeTeacher,
    catchErrors(catchErrors(controllers.delete.bind(controllers)))
  );
  router.patch(
    detailPath,
    authorizeTeacher,
    catchErrors(catchErrors(controllers.update.bind(controllers)))
  );
};
