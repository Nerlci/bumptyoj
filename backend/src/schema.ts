import { timeStamp } from "node:console";
import { z } from "zod";

export const user = z.object({
  userId: z.number().default(0),
  email: z.string().email(),
  username: z.string(),
  type: z.number().default(0),
  password: z.string(),
});
export type User = z.infer<typeof user>;

export const responseBase = z.object({
  code: z
    .union([z.literal("200"), z.literal("400"), z.literal("500")])
    .default("200"),
  error: z
    .object({
      msg: z.string().default(""),
    })
    .passthrough(),
  payload: z.object({}).passthrough(),
});

export const dateRange = z
  .object({
    startDate: z.date(),
    endDate: z.date(),
  })
  .refine((d) => d.endDate >= d.startDate, {
    message: "End date must be later than or equal to the start date",
  });
export type DateRange = z.infer<typeof dateRange>;

export const problemMetadata = z.object({
  problemId: z.number().default(0),
  displayId: z.string(),
  acceptedCount: z.number().default(0),
  submissionCount: z.number().default(0),
  title: z.string(),
  createdAt: z.date().default(() => new Date()),
  difficulty: z.string(),
  time: z.number(),
  memory: z.number(),
});

export const problem = z.object({
  metadata: problemMetadata,
  description: z.string(),
  format: z.object({
    input: z.string(),
    output: z.string(),
  }),
  sample: z.object({
    input: z.string(),
    output: z.string(),
  }),
  other: z.string(),
});
export type Problem = z.infer<typeof problem>;

export const class_ = z.object({
  classId: z.number().default(0),
  teacherId: z.number(),
  name: z.string().optional(),
  students: z.array(z.number()).default([]),
  className: z.string().default(""),
});
export type Class = z.infer<typeof class_>;

export const testdata = z.object({
  testdataId: z.number().default(0),
  problemId: z.number(),
  input: z.string(),
  output: z.string(),
  inputFilename: z.string(),
  outputFilename: z.string(),
});
export type Testdata = z.infer<typeof testdata>;

export const submissionDetail = z.object({
  submissionId: z.number(),
  testdataId: z.number(),
  status: z.string(),
  time: z.number().int(),
  memory: z.number().int(),
  score: z.number().int().gte(0).lte(100),
});
export type SubmissionDetail = z.infer<typeof submissionDetail>;

export const submission = z.object({
  submissionId: z.number().default(0),
  problemId: z.number(),
  userId: z.number(),
  problemsetId: z.number().optional().nullable(),
  code: z.string(),
  language: z.string(),
  length: z.number().int(),
  time: z.number().int().default(0),
  memory: z.number().int().default(0),
  score: z.number().int().gte(0).lte(100).default(0),
  status: z.string().default("Pending"),
  timestamp: z.date().default(() => new Date()),
  detail: z.array(submissionDetail).default([]),
});
export type Submission = z.infer<typeof submission>;

export const discussionPost = z.object({
  postId: z.number().default(0),
  userId: z.number(),
  title: z.string(),
  author: z.string(),
  content: z.string(),
  category: z.string(),
  timestamp: z.date().default(() => new Date()),
});
export type DiscussionPost = z.infer<typeof discussionPost>;

export const comment = z.object({
  commentId: z.number().default(0),
  postId: z.number().default(0),
  userId: z.number(),
  author: z.string(),
  content: z.string(),
  timestamp: z.date().default(() => new Date()),
});
export type Comment = z.infer<typeof comment>;

export const problemSet = z
  .object({
    setId: z.number().default(0),
    title: z.string(),
    type: z
      .number()
      .int()
      .refine((value) => value === 0 || value === 1, {
        message: "type can only be 0 or 1",
      })
      .default(0),
    contestType: z
      .number()
      .int()
      .refine((value) => value === 0 || value === 1, {
        message: "contestType can only be 0 or 1",
      })
      .default(0),
    description: z.string().optional(),
    startTime: z.date().optional(),
    endTime: z.date().optional(),
    problems: z.array(z.number()).default([]),
  })
  .refine(
    (d) =>
      d.startTime === undefined ||
      d.endTime === undefined ||
      d.endTime >= d.startTime,
    {
      message: "End time must be later than or equal to the start time",
    },
  );
export type ProblemSet = z.infer<typeof problemSet>;

export class BumptyError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}
