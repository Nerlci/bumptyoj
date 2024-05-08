import express from "express";
import { submissionController } from "../controller/submissionController";
import { authUserMiddleware } from "../controller/userController";

const submissionRouter = express.Router();

submissionRouter.post(
  "/submit",
  authUserMiddleware,
  submissionController.postSubmit,
);

submissionRouter.get("/submission", submissionController.getSubmission);

submissionRouter.get("/list", submissionController.listSubmission);

submissionRouter.get("/count", submissionController.countSubmission);

export { submissionRouter };
