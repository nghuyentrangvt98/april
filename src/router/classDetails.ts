import express from "express";

import { authorizeTeacher, authorize } from "../middleware/authentication";
import { catchErrors } from "../middleware/exceptionHandler";
import { classDetailController } from "../controllers/classDetails";

let controllers = new classDetailController();
let path = "/class-details";
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
    authorize,
    catchErrors(catchErrors(controllers.create.bind(controllers)))
  );
  router.delete(
    detailPath,
    authorizeTeacher,
    catchErrors(catchErrors(controllers.delete.bind(controllers)))
  );
  router.patch(
    path,
    authorizeTeacher,
    catchErrors(catchErrors(controllers.updateBulk.bind(controllers)))
  );
  router.patch(
    detailPath,
    authorizeTeacher,
    catchErrors(catchErrors(controllers.update.bind(controllers)))
  );
};
