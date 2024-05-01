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

export const DateRange = z
    .object({
        startDate: z.date(),
        endDate: z.date(),
    })
    .refine((d) => d.endDate >= d.startDate, {
        message: "End date must be later than or equal to the start date",
    });
export type DateRange = z.infer<typeof DateRange>;