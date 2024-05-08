import { prisma } from "../prisma";
import { Problem, Testdata, problem, problemMetadata } from "../schema";

const mapProblemToResponse = (problem: Problem) => {
  const { format, sample, metadata, ...rest } = problem;
  const { problemId, acceptedCount, submissionCount, ...metadataRest } =
    metadata;

  return {
    ...metadataRest,
    ...rest,
    inputFormat: format.input,
    outputFormat: format.output,
    sampleInput: sample.input,
    sampleOutput: sample.output,
    testdata: {},
  };
};

const mapResponseToProblem = (data: any) => {
  if (!data) return null;

  // TODO: Query submission count and accepted count
  return problem.parse({
    metadata: problemMetadata.parse({
      problemId: data.id,
      ...data,
    }),
    description: data.description,
    format: {
      input: data.inputFormat,
      output: data.outputFormat,
    },
    sample: {
      input: data.sampleInput,
      output: data.sampleOutput,
    },
    other: data.other,
  });
};

const mapResponseToProblemMetadata = (data: any) => {
  if (!data) return null;

  // TODO: Query submission count and accepted count
  return problemMetadata.parse({
    problemId: data.id,
    ...data,
  });
};

const createProblem = async (data: Problem) => {
  return prisma.problem.create({
    data: mapProblemToResponse(data),
  });
};

const modifyProblem = async (problemId: number, data: Problem) => {
  return prisma.problem.update({
    where: {
      id: problemId,
    },
    data: mapProblemToResponse(data),
  });
};

const getProblem = async (problemId: number) => {
  return prisma.problem.findUnique({
    where: {
      id: problemId,
    },
  });
};

const deleteProblem = async (problemId: number) => {
  return prisma.problem.delete({
    where: {
      id: problemId,
    },
  });
};

const countProblem = async () => {
  return prisma.problem.count();
};

const listProblem = async (count: number, offset: number) => {
  return prisma.problem.findMany({
    take: count,
    skip: offset,
  });
};

const getTestdataByProblemId = async (problemId: number) => {
  return prisma.testdata.findMany({
    where: {
      problemId,
    },
  });
};

const getTestdata = async (testdataId: number) => {
  return prisma.testdata.findUnique({
    where: {
      id: testdataId,
    },
  });
};

const createTestdata = async (data: Testdata) => {
  const { testdataId, ...rest } = data;

  return prisma.testdata.create({
    data: {
      ...rest,
    },
  });
};

const modifyTestdata = async (testdataId: number, data: Testdata) => {
  return prisma.testdata.update({
    where: {
      id: testdataId,
    },
    data: {
      ...data,
    },
  });
};

const deleteTestdata = async (testdataId: number) => {
  return prisma.testdata.delete({
    where: {
      id: testdataId,
    },
  });
};

const problemService = {
  mapResponseToProblem,
  mapProblemToResponse,
  mapResponseToProblemMetadata,
  createProblem,
  modifyProblem,
  getProblem,
  deleteProblem,
  countProblem,
  listProblem,
  getTestdataByProblemId,
  getTestdata,
  createTestdata,
  modifyTestdata,
  deleteTestdata,
};

export { problemService };
