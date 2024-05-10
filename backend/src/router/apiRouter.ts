import express from "express";
import { userRouter } from "./userRouter";
import { problemRouter } from "./problemRouter";
import { submissionRouter } from "./submissionRouter";
import { discussionRouter } from "./discussionRouter";
import { classRouter } from "./classRouter";
import { leaderboardRouter } from "./leaderboardRouter";

let apiRouter = express.Router();

apiRouter.post("/echo", async (req, res) => {
  res.send(req.body);
});

apiRouter.use("/user", userRouter);

apiRouter.use("/problem", problemRouter);

apiRouter.use("/submission", submissionRouter);

apiRouter.use("/discussion", discussionRouter);

apiRouter.use("/class", classRouter);

apiRouter.use("/leaderboard", leaderboardRouter);

export { apiRouter };
