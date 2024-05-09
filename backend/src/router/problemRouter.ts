import express from "express";
import multer from "multer";
import { authUserMiddleware } from "../controller/userController";
import { problemController } from "../controller/problemController";

let problemRouter = express.Router();

const upload = multer({ dest: "uploads/" });

problemRouter.get("/problem", problemController.getProblem);

problemRouter.post(
  "/problem",
  authUserMiddleware,
  problemController.createProblem,
);

problemRouter.put(
  "/problem",
  authUserMiddleware,
  problemController.modifyProblem,
);

problemRouter.delete(
  "/problem",
  authUserMiddleware,
  problemController.deleteProblem,
);

problemRouter.get("/list", problemController.listProblem);

problemRouter.get("/count", problemController.countProblem);

problemRouter.get(
  "/testdata",
  authUserMiddleware,
  problemController.getTestdata,
);

problemRouter.post(
  "/testdata",
  authUserMiddleware,
  upload.fields([
    { name: "inputFile", maxCount: 1 },
    { name: "outputFile", maxCount: 1 },
  ]),
  problemController.createTestdata,
);

problemRouter.put(
  "/testdata",
  authUserMiddleware,
  upload.fields([
    { name: "inputFile", maxCount: 1 },
    { name: "outputFile", maxCount: 1 },
  ]),
  problemController.modifyTestdata,
);

problemRouter.delete(
  "/testdata",
  authUserMiddleware,
  problemController.deleteTestdata,
);

problemRouter.get(
  "/download",
  authUserMiddleware,
  problemController.downloadTestdata,
);

problemRouter.get(
  "/downloadAll",
  authUserMiddleware,
  problemController.downloadAllTestdata,
);

export { problemRouter };
