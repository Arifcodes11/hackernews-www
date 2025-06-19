import { z } from "zod";
import { postSchema } from "./schemas/FeedPage";
import { commentSchema } from "./schemas/comment";

// schemas/user.ts
export const likeSchema = z.object({
  id: z.string(),
});

export const apiResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    image: z.string().nullable(),
    about: z.string().nullable(),
    createdAt: z.string(),
    posts: z.array(postSchema),
    comments: z.array(
      commentSchema.extend({
        post: z.object({
          id: z.string(),
          title: z.string(),
        }),
      })
    ),
    likes: z.array(
      likeSchema.extend({
        post: z.object({
          id: z.string(),
          title: z.string(),
          text: z.string(),
        }),
        createdAt: z.string(),
      })
    ),
  }),
});