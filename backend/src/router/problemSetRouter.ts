import express from "express";
import { authUserMiddleware } from "../controller/userController";
import { problemSetController } from "../controller/problemSetController";

let problemSetRouter = express.Router();

problemSetRouter.post(
  "/problemset",
  authUserMiddleware,
  problemSetController.createProblemSet,
);

problemSetRouter.get("/problemset", problemSetController.getProblemSet);

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

problemSetRouter.get("/contest", problemSetController.getContestList);

problemSetRouter.post(
  "/contest",
  authUserMiddleware,
  problemSetController.attendContest,
);

problemSetRouter.get("/count", problemSetController.countProblemSet);

problemSetRouter.get("/homework/count", problemSetController.countHomework);

problemSetRouter.get("/contest/count", problemSetController.countContest);

problemSetRouter.get(
  "/contest/status",
  authUserMiddleware,
  problemSetController.getContestStatus,
);

export { problemSetRouter };
