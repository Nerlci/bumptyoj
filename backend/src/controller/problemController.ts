import { Request, Response } from "express";

import { unlink } from "fs";

import { problemService } from "../service/problemService";
import { problem, responseBase, testdata } from "../schema";
import test from "node:test";
import { count } from "console";

interface TestdataRequest extends Request {
  files: {
    inputFile: Express.Multer.File[];
    outputFile: Express.Multer.File[];
  };
}

const createProblem = async (req: Request, res: Response) => {
  const { metadata, ...rest } = req.body;
  const data = {
    metadata,
    ...rest,
  };

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
};

const modifyProblem = async (req: Request, res: Response) => {
  const { metadata, ...rest } = req.body;
  const data = {
    metadata,
    ...rest,
  };

  const prob = problem.parse(data);

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
};

const getProblem = async (req: Request, res: Response) => {
  const problemId = Number(req.query.problemId);
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
};

const deleteProblem = async (req: Request, res: Response) => {
  const problemId = Number(req.query.problemId);
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
  const result = await problemService.listProblem(count, offset);

  const resProb = result.map((result) =>
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
};

const deletePreviousFiles = async (testdataId: number) => {
  const previous = await problemService.getTestdata(testdataId);

  if (!previous) {
    return false;
  }

  unlink(previous.input, () => {});
  unlink(previous.output, () => {});

  return true;
};

const getTestdata = async (req: Request, res: Response) => {
  const problemId = Number(req.query.problemId);
  const result = await problemService.getTestdataByProblemId(problemId);

  const resTestdata = result.map((result) => {
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
};

// TODO: move score, time and memory setting to testdata
const createTestdata = async (req: Request, res: Response) => {
  const problemId = Number(req.body.problemId);

  const filesReq = req as TestdataRequest;
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
};

const modifyTestdata = async (req: Request, res: Response) => {
  const testdataId = Number(req.query.testdataId);

  const filesReq = req as TestdataRequest;
  const data = testdata.parse({
    input: filesReq.files!.inputFile[0].path,
    output: filesReq.files!.outputFile[0].path,
    inputFilename: filesReq.files!.inputFile[0].originalname,
    outputFilename: filesReq.files!.outputFile[0].originalname,
  });

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
};

const downloadTestdata = async (req: Request, res: Response) => {
  const testdataId = Number(req.query.testdataId);
  const file = Number(req.query.file);
  const result = await problemService.getTestdata(testdataId);

  if (file === 0) {
    res.download(result!.input, result!.inputFilename);
  } else {
    res.download(result!.output, result!.outputFilename);
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
};

export { problemController };
