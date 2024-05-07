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
