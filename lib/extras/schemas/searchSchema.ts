import { z } from "zod";

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  text: z.string(),
  createdAt: z.string(), // loosen from .datetime() if needed
  author: z
    .union([
      z.string(),
      z.object({
        id: z.string(),
        name: z.string(),
        image: z.string().nullable().optional(),
      }),
    ])
    .nullable()
    .optional(), // author can be missing or null
});

export const searchSchema = z.array(postSchema);
