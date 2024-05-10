import { Request, Response } from "express";
import { responseBase } from "../schema";
import { leaderboardService } from "../service/leaderboardService";

const countLeaderboard = async (req: Request, res: Response) => {
  const startTime = req.query.startTime as string | undefined;
  const endTime = req.query.endTime as string | undefined;

  const countLeaderboard = await leaderboardService.countLeaderboard(
    startTime,
    endTime,
  );

  res.json(
    responseBase.parse({
      code: "200",
      payload: {
        leaderboard: countLeaderboard,
      },
      error: { msg: "" },
    }),
  );
};

const weightedLeaderboard = async (req: Request, res: Response) => {
  const startTime = req.query.startTime as string | undefined;
  const endTime = req.query.endTime as string | undefined;

  const weightedLeaderboard = await leaderboardService.weightedLeaderboard(
    startTime,
    endTime,
  );

  res.json(
    responseBase.parse({
      code: "200",
      payload: {
        leaderboard: weightedLeaderboard,
      },
      error: { msg: "" },
    }),
  );
};

const problemsetLeaderboard = async (req: Request, res: Response) => {
  const problemsetId = Number(req.query.problemsetId);

  const problemsetLeaderboard =
    await leaderboardService.problemsetLeaderboard(problemsetId);

  res.json({
    code: "200",
    payload: {
      leaderboard: problemsetLeaderboard,
    },
    error: { msg: "" },
  });
};

const leaderboardController = {
  countLeaderboard,
  weightedLeaderboard,
  problemsetLeaderboard,
};

export { leaderboardController };
