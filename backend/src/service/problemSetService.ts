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
    startTime: data.startTime,
    endTime: data.endTime,
    problems: {
      connect: data.problems.map((id) => ({ id })),
    },
  };
};

const mapProblemSetToResponse = (result: any) => {
  return {
    ...mapProblemSetToResponseBase(result),
    problems: result.problems,
    contestType: result.contestType,
  };
};

const mapProblemSetToResponseWithClass = (result: any) => {
  return {
    className: result.classes.map((cls: any) => cls.name),
    homework: {
      ...mapProblemSetToResponseBase(result),
      problems: result.problems,
    },
  };
};

const mapProblemSetToResponseForHomework = (result: any) => {
  return result.map((res: any) => {
    return {
      ...mapProblemSetToResponseBase(res),
    };
  });
};

const mapProblemSetToResponseForContest = (result: any) => {
  return result.map((res: any) => {
    return {
      ...mapProblemSetToResponseBase(res),
      contestType: res.contestType,
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
      problems: {
        select: {
          id: true,
          title: true,
          displayId: true,
        },
      },
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
  const problemSet = await prisma.problemSet.findUnique({
    where: {
      id: setId,
    },
  });

  if (problemSet!.startTime! < new Date()) {
    throw new Error("Problemset already started");
  }

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

const getHomeworkList = async (
  classId: number,
  count: number,
  offset: number,
) => {
  const result = await prisma.problemSet.findMany({
    where: {
      type: 1,
      classes: {
        some: {
          id: classId,
        },
      },
    },
    take: count,
    skip: offset,
  });

  // TODO: check 如果为空是否需要报错
  return result && result.length > 0
    ? mapProblemSetToResponseForHomework(result)
    : [];
};

const getContestList = async (count: number, offset: number) => {
  const result = await prisma.problemSet.findMany({
    where: {
      type: 0,
    },
    take: count,
    skip: offset,
  });

  return result && result.length > 0
    ? mapProblemSetToResponseForContest(result)
    : [];
};

const countHomework = async (classId: number) => {
  return prisma.problemSet.count({
    where: {
      classes: {
        some: {
          id: classId,
        },
      },
      type: 1,
    },
  });
};

const countContest = async () => {
  return prisma.problemSet.count({
    where: {
      type: 0,
    },
  });
};

const countProblemSet = async () => {
  return prisma.problemSet.count();
};

const getProblemSetStatus = async (setId: number, userId: number) => {
  const users = await getProblemSetUsers(setId);
  return users.includes(userId);
};

const getProblemSetUsers = async (setId: number) => {
  const result = await prisma.problemSet.findUnique({
    where: {
      id: setId,
    },
    include: {
      users: {
        select: {
          id: true,
          username: true,
        },
      },
      classes: {
        include: {
          students: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
  });

  result!.users = result!.users.concat(
    result!.classes.flatMap((cls) => cls.students),
  );

  return result ? result.users.map((user) => user.id) : [];
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
  countHomework,
  countContest,
  countProblemSet,
  getProblemSetStatus,
  getProblemSetUsers,
};
