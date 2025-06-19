import { z } from "zod";

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  text: z.string(),
  createdAt: z.string().datetime(),
  author: z.object({
    id: z.string(),
    name: z.string(),
    image: z.string().nullable().optional(),
  }),
});

export const feedSchema = z.object({
  page: z.number(),
  limit: z.number(),
  data: z.array(postSchema),
});
