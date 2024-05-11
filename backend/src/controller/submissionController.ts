import { Request, Response } from "express";
import { submissionService } from "../service/submissionService";
import { responseBase, submission } from "../schema";
import { handleErrors } from "../utils/utils";
import { problemSetService } from "../service/problemSetService";

const postSubmit = async (req: Request, res: Response) => {
  try {
    const { problemId, problemsetId, code, language } = req.body;
    const userId = res.locals.user.userId;

    const submissionData = submission.parse({
      problemId,
      problemsetId,
      userId,
      code,
      language,
      length: Buffer.byteLength(code, "utf-8"),
    });

    const result = await submissionService.handleJudge(submissionData);

    res.send(
      responseBase.parse({
        code: "200",
        payload: {
          submissionId: result.id,
          problemId: result.problemId,
          userId: result.userId,
          language: result.language,
          timestamp: result.timestamp,
        },
        error: { message: "" },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const getSubmission = async (req: Request, res: Response) => {
  try {
    const submissionId = Number(req.query.submissionId);

    const result = await submissionService.getSubmission(submissionId);
    const { id, detail, ...rest } = result!;
    const detailData = detail.map((d) => {
      const { id, submissionId, ...rest } = d;
      return {
        ...rest,
      };
    });

    res.send(
      responseBase.parse({
        code: "200",
        payload: {
          submissionId: id,
          ...rest,
          detail: detailData,
        },
        error: { message: "" },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const listSubmission = async (req: Request, res: Response) => {
  try {
    const count = Number(req.query.count);
    const maxId = Number(req.query.maxId) || undefined;
    const minId = Number(req.query.minId) || undefined;
    const submissionId = Number(req.query.submissionId) || undefined;
    const userId = Number(req.query.userId) || undefined;
    const problemId = Number(req.query.problemId) || undefined;

    const result = await submissionService.listSubmission(
      count,
      maxId,
      minId,
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

    res.send(
      responseBase.parse({
        code: "200",
        payload: {
          count: result.length,
          submissions: resultData,
        },
        error: { message: "" },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const countSubmission = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.query.userId) || undefined;
    const problemId = Number(req.query.problemId) || undefined;

    const result = await submissionService.countSubmission(userId, problemId);

    res.send(
      responseBase.parse({
        code: "200",
        payload: {
          count: result,
        },
        error: { message: "" },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const submissionController = {
  postSubmit,
  getSubmission,
  listSubmission,
  countSubmission,
};

export { submissionController };
