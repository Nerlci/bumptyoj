import express from "express";
import { leaderboardController } from "../controller/leaderboardController";

const leaderboardRouter = express.Router();

leaderboardRouter.get("/count", leaderboardController.countLeaderboard);

leaderboardRouter.get("/weighted", leaderboardController.weightedLeaderboard);

export { leaderboardRouter };
