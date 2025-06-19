import { z } from "zod";

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  text: z.string(),
  author: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export const paginatedFeedSchema = z.object({
  posts: z.array(postSchema),
  totalPages: z.number(),
  currentPage: z.number(),
});
