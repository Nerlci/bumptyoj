import { map, number } from "zod";
import { prisma } from "../prisma";
import { ProblemSet, Problem, user } from "../schema";

const mapProblemSetToResponseBase = (res: any) => ({
  problemsetId: res.id,
  title: res.title,
  description: res.description,
  type: res.type,
  startTime: res.startTime || "",
  endTime: res.endTime || "",
});

const mapDataToProblemSet = (data: ProblemSet) => {
  return {
    title: data.title,
    description: data.description,
    type: data.type,
    contestType: data.contestType,
    problems: {
      connect: data.problems.map((id) => ({ id })),
    },
  };
};

const mapProblemSetToResponse = (result: any) => {
  return {
    ...mapProblemSetToResponseBase(result),
    problems: result.problems.map((problem: any) => {
      return problem.id;
    }),
    contestType: result.contestType,
  };
};

const mapProblemSetToResponseWithClass = (result: any) => {
  return {
    className: result.classes.map((cls: any) => cls.name),
    homework: {
      ...mapProblemSetToResponseBase(result),
      problems: result.problems.map((problem: any) => {
        return problem.id;
      }),
    },
  };
};

const mapProblemSetToResponseForHomework = (result: any) => {
  return result.map((res: any) => {
    return {
      ...mapProblemSetToResponseBase(res),
      problems: res.problems.map((prob: any) => prob.id),
    };
  });
};

const createProblemSet = async (data: ProblemSet) => {
  const result = await prisma.problemSet.create({
    data: {
      ...mapDataToProblemSet(data),
      contestType: data.contestType,
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
  const result = await prisma.problemSet.update({
    where: {
      id: data.setId,
    },
    data: {
      ...mapDataToProblemSet(data),
      contestType: data.contestType,
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
        contestType: result.contestType,
      }
    : null;
};

const getHomeworkList = async (classId: number) => {
  const result = await prisma.problemSet.findMany({
    where: {
      classes: {
        some: {
          id: classId,
        },
      },
    },
    include: {
      problems: true,
    },
  });

  return result ? mapProblemSetToResponseForHomework(result) : null;
};

const getContestList = async (userId: number) => {
  const result = await prisma.problemSet.findMany({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
  });

  return result
    ? result.map((res: any) => {
        return {
          ...mapProblemSetToResponseBase(res),
          contestType: res.contestType,
        };
      })
    : null;
};

export const problemSetService = {
  createProblemSet,
  getProblemSet,
  modifyProblemSet,
  deleteProblemSet,
  issueHomework,
  attendContest,
  getHomeworkList,
  getContestList,
};
