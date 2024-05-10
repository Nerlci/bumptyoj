import { map, number } from "zod";
import { prisma } from "../prisma";
import { ProblemSet, Problem } from "../schema";

const mapProblemSetToResponse = (result: any) => {
  return {
    problemsetId: result.id,
    title: result.title,
    type: Number(result.type),
    description: result.description,
    startTime: result.startTime || "",
    endTime: result.endTime || "",
    problems: result.problems.map((problem: any) => {
      return problem.id;
    }),
  };
};

const mapProblemSetToResponseWithClass = (result: any) => {
  console.log(result.classes);
  return {
    className: result.classes.map((cls: any) => cls.name),
    homework: {
      problemsetId: result.id,
      title: result.title,
      type: Number(result.type),
      description: result.description,
      startTime: result.startTime || "",
      endTime: result.endTime || "",
      problems: result.problems.map((problem: any) => {
        return problem.id;
      }),
    },
  };
};

const createProblemSet = async (data: ProblemSet) => {
  console.log(data);

  const result = await prisma.problemSet.create({
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      contestType: data.contestType,
      problems: {
        connect: data.problems.map((id) => ({ id })),
      },
      startTime: data.startTime,
      endTime: data.endTime,
    },
    include: {
      problems: true,
    },
  });
  return result ? mapProblemSetToResponse(result) : null;
};

const getProblemSet = async (setId: number) => {
  const result = await prisma.problemSet.findUnique({
    where: {
      id: setId,
    },
    include: {
      problems: true,
    },
  });

  return result ? mapProblemSetToResponse(result) : null;
};

const modifyProblemSet = async (data: ProblemSet) => {
  console.log(data);
  const result = await prisma.problemSet.update({
    where: {
      id: data.setId,
    },
    data: {
      title: data.title,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      problems: {
        connect: data.problems.map((id) => ({ id })),
      },
    },
    include: {
      problems: true,
    },
  });

  return result ? mapProblemSetToResponse(result) : null;
};

const deleteProblemSet = async (setId: number) => {
  return prisma.problemSet.delete({
    where: {
      id: setId,
    },
  });
};

const issueHomework = async (data: any) => {
  const result = await prisma.problemSet.update({
    where: {
      id: data.problemsetId,
    },
    data: {
      classes: {
        connect: data.classIds.map((cls: number) => ({ id: cls })),
        // connect: data.classIds,
      },
      startTime: data.startTime,
      endTime: data.endTime,
    },
    include: {
      classes: true,
      problems: true,
    },
  });

  return result ? mapProblemSetToResponseWithClass(result) : null;
};

const attendContest = async (setId: number, userId: number) => {
  const result = await prisma.problemSet.update({
    where: {
      id: setId,
    },
    data: {
      users: {
        connect: { id: userId },
      },
    },
  });

  return result
    ? {
        title: result.title,
        description: result.description,
        startTime: result.startTime,
        endTime: result.endTime,
      }
    : null;
};

export const problemSetService = {
  createProblemSet,
  getProblemSet,
  modifyProblemSet,
  deleteProblemSet,
  issueHomework,
  attendContest,
};
