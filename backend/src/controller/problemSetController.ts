import { Request, Response } from "express";
import { z } from "zod";

import { responseBase, problem, problemSet } from "../schema";
import { problemSetService } from "../service/problemSetService";
import { send } from "process";

const sendErrorMsg = (res: Response, msg: string) => {
  res.send(
    responseBase.parse({
      code: "500",
      payload: {},
      error: {
        msg,
      },
    }),
  );
};

const createProblemSet = async (req: Request, res: Response) => {
  const { startTime, endTime, ...data } = req.body;
  data.startTime = startTime ? new Date(startTime) : null;
  data.endTime = endTime ? new Date(endTime) : null;

  try {
    const problemSetBody = problemSet.parse(data);
    const result = await problemSetService.createProblemSet(problemSetBody);

    res.send(
      responseBase.parse({
        code: "200",
        payload: result,
        error: {
          msg: "",
        },
      }),
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle Zod errors
      sendErrorMsg(res, error.errors.map((e) => e.message).join("; "));
    } else if (error instanceof Error) {
      sendErrorMsg(res, error.message);
    } else {
      // Handle other errors
      console.log(error);
      sendErrorMsg(res, String(error));
    }
  }
};

const getProblemSet = async (req: Request, res: Response) => {
  const setId = Number(req.query.problemsetId);
  const result = await problemSetService.getProblemSet(setId);

  res.send(
    responseBase.parse({
      code: "200",
      payload: result,
      error: {
        msg: "",
      },
    }),
  );
};

const modifyProblemSet = async (req: Request, res: Response) => {
  const { startTime, endTime, ...data } = req.body;
  data.startTime = startTime ? new Date(startTime) : null;
  data.endTime = endTime ? new Date(endTime) : null;
  data.setId = Number(req.query.problemsetId);

  const problemSetBody = problemSet.parse(data);

  const result = await problemSetService.modifyProblemSet(problemSetBody);

  res.send(
    responseBase.parse({
      code: "200",
      payload: result,
      error: {
        msg: "",
      },
    }),
  );
};

const deleteProblemSet = async (req: Request, res: Response) => {
  const setId = Number(req.query.problemsetId);
  const result = await problemSetService.deleteProblemSet(setId);

  res.send(
    responseBase.parse({
      code: "200",
      payload: {},
      error: {
        msg: "",
      },
    }),
  );
};

const issueHomework = async (req: Request, res: Response) => {
  const { startTime, endTime, ...data } = req.body;
  data.startTime = new Date(startTime);
  data.endTime = new Date(endTime);
  const result = await problemSetService.issueHomework(data);

  res.send(
    responseBase.parse({
      code: "200",
      payload: result,
      error: {
        msg: "",
      },
    }),
  );
};

const attendContest = async (req: Request, res: Response) => {
  const setId = req.body.problemsetId;
  const userId = res.locals.user.userId;

  const result = await problemSetService.attendContest(setId, userId);

  res.send(
    responseBase.parse({
      code: "200",
      payload: { contest: result },
      error: {
        msg: "",
      },
    }),
  );
};

const getHomeworkList = async (req: Request, res: Response) => {
  const classId = Number(req.query.classId);
  const count = Number(req.query.count);
  const offset = Number(req.query.offset);
  const result = await problemSetService.getHomeworkList(
    classId,
    count,
    offset,
  );

  res.send(
    responseBase.parse({
      code: "200",
      payload: { homeworkSets: result },
      error: {
        msg: "",
      },
    }),
  );
};

const getContestList = async (req: Request, res: Response) => {
  const count = Number(req.query.count);
  const offset = Number(req.query.offset);

  const result = await problemSetService.getContestList(count, offset);

  res.send(
    responseBase.parse({
      code: "200",
      payload: { contests: result },
      error: {
        msg: "",
      },
    }),
  );
};

const countProblemSet = async (req: Request, res: Response) => {
  const result = await problemSetService.countProblemSet();

  res.send(
    responseBase.parse({
      code: "200",
      payload: { count: result },
      error: {
        msg: "",
      },
    }),
  );
};

const countHomework = async (req: Request, res: Response) => {
  const result = await problemSetService.countHomework();

  res.send(
    responseBase.parse({
      code: "200",
      payload: { count: result },
      error: {
        msg: "",
      },
    }),
  );
};

const countContest = async (req: Request, res: Response) => {
  const result = await problemSetService.countContest();

  res.send(
    responseBase.parse({
      code: "200",
      payload: { count: result },
      error: {
        msg: "",
      },
    }),
  );
};

export const problemSetController = {
  createProblemSet,
  getProblemSet,
  modifyProblemSet,
  deleteProblemSet,
  issueHomework,
  attendContest,
  getHomeworkList,
  getContestList,
  countProblemSet,
  countHomework,
  countContest,
};
