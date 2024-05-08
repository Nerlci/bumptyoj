import { timeStamp } from "node:console";
import { z } from "zod";

export const responseBase = z.object({
  code: z
    .union([z.literal("200"), z.literal("400"), z.literal("500")])
    .default("200"),
  error: z.object({
    msg: z.string().default(""),
  }),
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
