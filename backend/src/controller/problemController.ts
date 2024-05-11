import { Request, Response } from "express";

import fs from "fs";
import archiver from "archiver";

import { problemService } from "../service/problemService";
import { problem, responseBase, testdata } from "../schema";
import { handleErrors } from "../utils/utils";

interface TestdataRequest extends Request {
  files: {
    inputFile: Express.Multer.File[];
    outputFile: Express.Multer.File[];
  };
}

const createProblem = async (req: Request, res: Response) => {
  const data = req.body;

  try {
    const prob = problem.parse(data);

    const result = await problemService.createProblem(prob);

    const resProb = problemService.mapResponseToProblem(result);
    res.send(
      responseBase.parse({
        code: "200",
        payload: resProb,
        error: {
          msg: "",
        },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const modifyProblem = async (req: Request, res: Response) => {
  const data = req.body;

  try {
    const previous = await problemService.getProblem(
      Number(req.query.problemId),
    );

    const prob = problem.parse({
      ...data,
      metadata: {
        acceptedCount: previous!.acceptedCount,
        submissionCount: previous!.submissionCount,
        createdAt: previous!.createdAt,
      },
    });

    const result = await problemService.modifyProblem(
      Number(req.query.problemId),
      prob,
    );

    const resProb = problemService.mapResponseToProblem(result);
    res.send(
      responseBase.parse({
        code: "200",
        payload: resProb,
        error: {
          msg: "",
        },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const getProblem = async (req: Request, res: Response) => {
  const problemId = Number(req.query.problemId);
  try {
    const result = await problemService.getProblem(problemId);

    const resProb = problemService.mapResponseToProblem(result);

    if (!resProb) {
      res.send(
        responseBase.parse({
          code: "400",
          payload: {},
          error: {
            msg: "Problem not found",
          },
        }),
      );
      return;
    }

    res.send(
      responseBase.parse({
        code: "200",
        payload: resProb,
        error: {
          msg: "",
        },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const deleteProblem = async (req: Request, res: Response) => {
  const problemId = Number(req.query.problemId);
  try {
    const result = await problemService.deleteProblem(problemId);
    res.send(
      responseBase.parse({
        code: "200",
        payload: {},
        error: {
          msg: "",
        },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const countProblem = async (req: Request, res: Response) => {
  const result = await problemService.countProblem();
  res.send(
    responseBase.parse({
      code: "200",
      payload: {
        count: result,
      },
      error: {
        msg: "",
      },
    }),
  );
};

const listProblem = async (req: Request, res: Response) => {
  const count = Number(req.query.count),
    offset = Number(req.query.offset);
  try {
    const result = await problemService.listProblem(count, offset);

    const resProb = result.map((result: any) =>
      problemService.mapResponseToProblemMetadata(result),
    );
    res.send(
      responseBase.parse({
        code: "200",
        payload: {
          count: resProb.length,
          problems: resProb,
        },
        error: {
          msg: "",
        },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const deletePreviousFiles = async (testdataId: number) => {
  const previous = await problemService.getTestdata(testdataId);

  if (!previous) {
    return false;
  }

  fs.unlink(previous.input, () => {});
  fs.unlink(previous.output, () => {});

  return true;
};

const getTestdata = async (req: Request, res: Response) => {
  const problemId = Number(req.query.problemId);
  try {
    const result = await problemService.getTestdataByProblemId(problemId);

    const resTestdata = result.map((result: any) => {
      return {
        testdataId: result.id,
        inputFilename: result.inputFilename,
        outputFilename: result.outputFilename,
      };
    });

    res.send(
      responseBase.parse({
        code: "200",
        payload: {
          count: resTestdata.length,
          problemId,
          testdata: resTestdata,
        },
        error: {
          msg: "",
        },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

// TODO: move score, time and memory setting to testdata
const createTestdata = async (req: Request, res: Response) => {
  const problemId = Number(req.body.problemId);

  const filesReq = req as TestdataRequest;
  try {
    const data = testdata.parse({
      problemId,
      input: filesReq.files!.inputFile[0].path,
      output: filesReq.files!.outputFile[0].path,
      inputFilename: filesReq.files!.inputFile[0].originalname,
      outputFilename: filesReq.files!.outputFile[0].originalname,
    });

    const result = await problemService.createTestdata(data);

    res.send(
      responseBase.parse({
        code: "200",
        payload: {
          problemId: result.problemId,
          testdata: {
            testdataId: result.id,
            inputFilename: result.inputFilename,
            outputFilename: result.outputFilename,
          },
        },
        error: {
          msg: "",
        },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const modifyTestdata = async (req: Request, res: Response) => {
  const testdataId = Number(req.query.testdataId);
  const previous = await problemService.getTestdata(testdataId);

  const filesReq = req as TestdataRequest;

  if (!(await deletePreviousFiles(testdataId))) {
    res.send(
      responseBase.parse({
        code: "400",
        payload: {},
        error: {
          msg: "Testdata not found",
        },
      }),
    );
    return;
  }

  try {
    const data = testdata.parse({
      problemId: previous!.problemId,
      input: filesReq.files!.inputFile[0].path,
      output: filesReq.files!.outputFile[0].path,
      inputFilename: filesReq.files!.inputFile[0].originalname,
      outputFilename: filesReq.files!.outputFile[0].originalname,
    });

    const result = await problemService.modifyTestdata(testdataId, data);

    res.send(
      responseBase.parse({
        code: "200",
        payload: {
          problemId: result.problemId,
          testdata: {
            testdataId: result.id,
            inputFilename: result.inputFilename,
            outputFilename: result.outputFilename,
          },
        },
        error: {
          msg: "",
        },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const deleteTestdata = async (req: Request, res: Response) => {
  const testdataId = Number(req.query.testdataId);

  if (!(await deletePreviousFiles(testdataId))) {
    res.send(
      responseBase.parse({
        code: "400",
        payload: {},
        error: {
          msg: "Testdata not found",
        },
      }),
    );
    return;
  }

  try {
    const result = await problemService.deleteTestdata(testdataId);
    res.send(
      responseBase.parse({
        code: "200",
        payload: {},
        error: {
          msg: "",
        },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const downloadTestdata = async (req: Request, res: Response) => {
  const testdataId = Number(req.query.testdataId);
  const file = Number(req.query.file);
  try {
    const result = await problemService.getTestdata(testdataId);

    if (file === 0) {
      res.download(result!.input, result!.inputFilename);
    } else {
      res.download(result!.output, result!.outputFilename);
    }
  } catch (error) {
    handleErrors(error, res);
  }
};

const downloadAllTestdata = async (req: Request, res: Response) => {
  const problemId = Number(req.query.problemId);
  try {
    const results = await problemService.getTestdataByProblemId(problemId);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=testdata_${problemId}.zip`,
    );
    const archive = archiver("zip");
    archive.pipe(res);

    results.forEach((result) => {
      archive.append(fs.createReadStream(result.input), {
        name: result.inputFilename,
      });
      archive.append(fs.createReadStream(result.output), {
        name: result.outputFilename,
      });
    });

    await archive.finalize();
  } catch (error) {
    handleErrors(error, res);
  }
};

const problemController = {
  createProblem,
  modifyProblem,
  getProblem,
  deleteProblem,
  countProblem,
  listProblem,
  getTestdata,
  createTestdata,
  modifyTestdata,
  deleteTestdata,
  downloadTestdata,
  downloadAllTestdata,
};

export { problemController };
