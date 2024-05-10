import { Request, Response } from "express";

import { responseBase, problem, problemSet } from "../schema";
import { problemSetService } from "../service/problemSetService";

const createProblemSet = async (req: Request, res: Response) => {
  const { startTime, endTime, ...data } = req.body;
  data.startTime = startTime ? new Date(startTime) : null;
  data.endTime = endTime ? new Date(endTime) : null;

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
  const { problemsetId, startTime, endTime, ...data } = req.body;
  data.startTime = startTime ? new Date(startTime) : null;
  data.endTime = endTime ? new Date(endTime) : null;
  data.setId = problemsetId;

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
  const result = await problemSetService.getHomeworkList(classId);

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
  const userId = res.locals.user.userId;

  const result = await problemSetService.getContestList(userId);

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
