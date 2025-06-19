import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullable().optional(),
});

export const commentSchema = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.string(), // changed for broader compatibility
  user: userSchema,
  postId: z.string(),
});

export const commentsSchema = commentSchema.array();

export type Comment = z.infer<typeof commentSchema>;
export type Comments = z.infer<typeof commentsSchema>;
