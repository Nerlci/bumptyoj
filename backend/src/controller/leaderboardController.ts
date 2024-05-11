import { Request, Response } from "express";
import { responseBase } from "../schema";
import { leaderboardService } from "../service/leaderboardService";
import { handleErrors } from "../utils/utils";

const countLeaderboard = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    handleErrors(error, res);
  }
};

const weightedLeaderboard = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    handleErrors(error, res);
  }
};

const problemsetLeaderboard = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    handleErrors(error, res);
  }
};

const leaderboardController = {
  countLeaderboard,
  weightedLeaderboard,
  problemsetLeaderboard,
};

export { leaderboardController };
