import { prisma } from "../prisma";
import { Submission, submission, submissionDetail } from "../schema";
import { problemService } from "./problemService";

const judgeList: Submission[] = [];

const generateResult = async (submissionData: Submission) => {
  const testdatas = await problemService.getTestdataByProblemId(
    submissionData.problemId,
  );

  const problemData = await problemService.getProblem(submissionData.problemId);

  const detailStatus = [
    "Accepted",
    "Wrong Answer",
    "Time Limit Exceeded",
    "Memory Limit Exceeded",
    "Runtime Error",
    "Compile Error",
  ];

  const detail = [];
  let accepted = true;
  submissionData.time = 0;
  submissionData.memory = 0;
  submissionData.score = 0;

  for (let testdata of testdatas) {
    const status =
      detailStatus[Math.floor(Math.random() * detailStatus.length)];
    const result = submissionDetail.parse({
      submissionId: submissionData.submissionId,
      testdataId: testdata.id,
      status: status,
      time: Math.round(Math.random() * problemData!.time),
      memory: Math.round(Math.random() * problemData!.memory),
      score: Math.round(status === "Accepted" ? 100 / testdatas.length : 0),
    });

    accepted &&= result.status === "Accepted";
    submissionData.time += result.time;
    submissionData.memory = Math.max(submissionData.memory, result.memory);
    submissionData.score += result.score;

    detail.push(result);
  }

  return {
    ...submissionData,
    detail,
    status: accepted ? "Accepted" : "Unaccepted",
  };
};

// TODO: Replace with real judge, e.g.: hydro-judge
const judge = setInterval(async () => {
  if (judgeList.length === 0) return;

  const submissionData = judgeList.shift()!;

  const result = await generateResult(submissionData);

  resultCallback(result);
}, 1000);

const handleJudge = async (data: Submission) => {
  const { submissionId, detail, ...rest } = data;

  const result = await prisma.submission.create({
    data: {
      ...rest,
      detail: {
        createMany: {
          data: detail,
        },
      },
    },
  });

  const problemData = problemService.mapResponseToProblem(
    await problemService.getProblem(data.problemId),
  );
  problemData!.metadata.submissionCount += 1;
  problemService.modifyProblem(data.problemId, problemData!);

  const submissionData = submission.parse({
    ...result,
    submissionId: result.id,
  });

  judgeList.push(submissionData);

  return result;
};

const resultCallback = async (data: Submission) => {
  const { detail, submissionId, ...rest } = data;

  const detailData = detail.map((d) => {
    const { submissionId, ...rest } = d;
    return {
      ...rest,
    };
  });

  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      ...rest,
      detail: {
        createMany: {
          data: detailData,
        },
      },
    },
  });

  if (data.status === "Accepted") {
    const problemData = problemService.mapResponseToProblem(
      await problemService.getProblem(data.problemId),
    );
    problemData!.metadata.acceptedCount += 1;
    problemService.modifyProblem(data.problemId, problemData!);
  }
};

const getSubmission = async (submissionId: number) => {
  return prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      detail: true,
    },
  });
};

const listSubmission = async (
  count: number,
  maxId: number | undefined,
  submissionId: number | undefined,
  userId: number | undefined,
  problemId: number | undefined,
) => {
  return prisma.submission.findMany({
    orderBy: {
      id: "desc",
    },
    take: count,
    where: {
      id: {
        ...(maxId ? { lt: maxId } : {}),
        equals: submissionId,
      },
      ...(userId ? { userId: userId } : {}),
      ...(problemId ? { problemId: problemId } : {}),
    },
  });
};

const countSubmission = async (
  userId: number | undefined,
  problemId: number | undefined,
) => {
  return prisma.submission.count({
    where: {
      ...(userId ? { userId: userId } : {}),
      ...(problemId ? { problemId: problemId } : {}),
    },
  });
};

const submissionService = {
  handleJudge,
  getSubmission,
  listSubmission,
  countSubmission,
};

export { submissionService };
