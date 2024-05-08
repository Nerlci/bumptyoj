import { Request, Response } from "express";
import { submissionService } from "../service/submissionService";
import { submission } from "../schema";
import { timeStamp } from "console";

const postSubmit = async (req: Request, res: Response) => {
  const { problemId, code, language } = req.body;
  const userId = res.locals.user.userId;

  const submissionData = submission.parse({
    problemId,
    userId,
    code,
    language,
    length: Buffer.byteLength(code, "utf-8"),
  });

  const result = await submissionService.handleJudge(submissionData);

  res.json({
    code: "200",
    payload: {
      submissionId: result.id,
      problemId: result.problemId,
      userId: result.userId,
      language: result.language,
      timestamp: result.timestamp,
    },
  });
};

const getSubmission = async (req: Request, res: Response) => {
  const submissionId = Number(req.query.submissionId);

  const result = await submissionService.getSubmission(submissionId);
  const { id, detail, ...rest } = result!;
  const detailData = detail.map((d) => {
    const { id, submissionId, ...rest } = d;
    return {
      ...rest,
    };
  });

  res.json({
    code: "200",
    payload: {
      submissionId: id,
      ...rest,
      detail: detailData,
    },
  });
};

const listSubmission = async (req: Request, res: Response) => {
  const count = Number(req.query.count);
  const maxId = Number(req.query.maxId);
  const submissionId = Number(req.query.submissionId) || undefined;
  const userId = Number(req.query.userId) || undefined;
  const problemId = Number(req.query.problemId) || undefined;

  const result = await submissionService.listSubmission(
    count,
    maxId,
    submissionId,
    userId,
    problemId,
  );

  const resultData = result.map((r) => {
    const { id, code, ...rest } = r;
    return {
      submissionId: id,
      ...rest,
    };
  });

  res.json({
    code: "200",
    payload: {
      count: result.length,
      submissions: resultData,
    },
  });
};

const countSubmission = async (req: Request, res: Response) => {
  const userId = Number(req.query.userId) || undefined;
  const problemId = Number(req.query.problemId) || undefined;

  const result = await submissionService.countSubmission(userId, problemId);

  res.json({
    code: "200",
    payload: {
      count: result,
    },
  });
};

const submissionController = {
  postSubmit,
  getSubmission,
  listSubmission,
  countSubmission,
};

export { submissionController };
