import express from "express";
import { authUserMiddleware } from "../controller/userController";
import { problemSetController } from "../controller/problemSetController";

let problemSetRouter = express.Router();

// problemSetRouter.get("/problemset", authUserMiddleware, problemSetController.getProblemSet);

problemSetRouter.post(
  "/problemset",
  authUserMiddleware,
  problemSetController.createProblemSet,
);

problemSetRouter.get(
  "/problemset",
  authUserMiddleware,
  problemSetController.getProblemSet,
);

problemSetRouter.put(
  "/problemset",
  authUserMiddleware,
  problemSetController.modifyProblemSet,
);

problemSetRouter.delete(
  "/problemset",
  authUserMiddleware,
  problemSetController.deleteProblemSet,
);

problemSetRouter.get(
  "/homework",
  authUserMiddleware,
  problemSetController.getHomeworkList,
);

problemSetRouter.post(
  "/homework",
  authUserMiddleware,
  problemSetController.issueHomework,
);

problemSetRouter.get(
  "/contest",
  authUserMiddleware,
  problemSetController.getContestList,
);

problemSetRouter.post(
  "/contest",
  authUserMiddleware,
  problemSetController.attendContest,
);

export { problemSetRouter };
