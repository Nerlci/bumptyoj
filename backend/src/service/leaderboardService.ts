import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";

type UserScore = {
  userId: number;
  username: string;
  score: number;
};

const getLeaderboard = (userScores: UserScore[]) => {
  let rank = 0;
  let lastCount = -1;

  const leaderboard = userScores.map((userScore, index) => {
    if (userScore.score !== lastCount) {
      rank = index + 1;
      lastCount = userScore.score;
    }

    return {
      userId: userScore.userId,
      username: userScore.username,
      score: userScore.score,
      rank,
    };
  });

  return leaderboard;
};

const countLeaderboard = async (
  startTime: string | undefined,
  endTime: string | undefined,
) => {
  const userScores = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          submission: {
            where: {
              status: "Accepted",
              timestamp: {
                gte: startTime ? startTime : undefined,
                lte: endTime ? endTime : undefined,
              },
            },
          },
        },
      },
    },
  });

  userScores.sort((a, b) => b._count.submission - a._count.submission);

  const countLeaderboard = await getLeaderboard(
    userScores.map((user) => ({
      userId: user.id,
      username: user.username!,
      score: user._count.submission,
    })),
  );

  return countLeaderboard;
};

const weightedLeaderboard = async (
  startTime: string | undefined,
  endTime: string | undefined,
) => {
  const difficultyMap = new Map<string, number>([
    ["简单", 1],
    ["中等", 1.5],
    ["困难", 2],
  ]);

  const caseString =
    Array.from(difficultyMap.entries()).reduce((acc, [difficulty, weight]) => {
      acc += `WHEN p.difficulty = '${difficulty}' THEN ${weight} `;
      return acc;
    }, "") + "ELSE 0";
  const startTimeCondition = startTime
    ? Prisma.sql`timestamp >= ${new Date(startTime)}`
    : "1=1";
  const endTimeCondition = endTime
    ? Prisma.sql`timestamp <= ${new Date(endTime)}`
    : "1=1";

  const scores = await prisma.$queryRaw<{ userId: number; score: number }[]>`
    SELECT s.userId, SUM(
      CASE
        ${Prisma.raw(caseString)}
      END
      ) as score
    FROM Submission s
    INNER JOIN Problem p ON s.problemId = p.id
    WHERE status = 'Accepted' 
    AND ${startTimeCondition}
    AND ${endTimeCondition}
    GROUP BY s.userId
    `;

  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
    },
  });

  const scoreMap = scores.reduce(
    (acc, { userId, score }) => {
      acc[userId] = Number(score!);
      return acc;
    },
    {} as Record<number, number>,
  );

  const userScores = users.map((user) => ({
    userId: user.id,
    username: user.username!,
    score: scoreMap[user.id] || 0,
  }));

  userScores.sort((a, b) => b.score - a.score);

  const weightedLeaderboard = await getLeaderboard(userScores);

  return weightedLeaderboard;
};

const problemsetLeaderboard = async (setId: number) => {
  const contestType = (await prisma.problemSet.findUnique({
    where: {
      id: setId,
    },
    select: {
      contestType: true,
    },
  }))!.contestType;
  const problemSet = await prisma.problemSet.findUnique({
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
      submissions: {
        where: {
          status: contestType == 1 ? "Accepted" : undefined,
          score: {
            gt: contestType == 0 ? 0 : undefined,
          },
        },
        select: {
          userId: true,
          problemId: true,
          score: true,
          status: true,
        },
      },
    },
  });

  const scores = problemSet!.submissions.reduce(
    (acc, submission) => {
      acc[submission.userId] = acc[submission.userId] || 0;

      if (contestType === 0) {
        acc[submission.userId] += submission.score;
      } else {
        // TODO: implement acm penalty
        acc[submission.userId] += submission.status == "Accepted" ? 1 : 0;
      }

      return acc;
    },
    {} as Record<number, number>,
  );

  problemSet!.users = problemSet!.users.concat(
    problemSet!.classes.flatMap((cls) => cls.students),
  );

  const userScores = problemSet!.users.map((user) => ({
    userId: user.id,
    username: user.username!,
    score: scores[user.id] || 0,
  }));

  userScores.sort((a, b) => b.score - a.score);

  return getLeaderboard(userScores);
};

const leaderboardService = {
  countLeaderboard,
  weightedLeaderboard,
  problemsetLeaderboard,
};

export { leaderboardService };
