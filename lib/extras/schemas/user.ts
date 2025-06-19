import { z } from "zod";

// Schema for post object including author
export const postUserSchema = z.object({
  id: z.string(),
  title: z.string(),
  text: z.string(),
  authorId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  author: z.object({
    id: z.string(),
    name: z.string().nullable(),
  }),
});

// Liked post schema (only title and date)
const likedPostSchema = z.object({
  postId: z.string(),
  title: z.string(),
  likedAt: z.string().datetime(),
});

// Commented post schema (title, comment, and date)
const commentedPostSchema = z.object({
  postId: z.string(),
  title: z.string(),
  commentText: z.string(),
  commentedAt: z.string().datetime(),
});

// User schema with liked and commented posts
export const userSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  about: z.string().nullable(),
  image: z.string().nullable(),
  createdAt: z.string().datetime(),
  posts: z.array(postUserSchema).default([]),
  likedPosts: z.array(likedPostSchema).default([]),
  commentedPosts: z.array(commentedPostSchema).default([]),
});

// Full API response schema
export const apiResponseSchema = z.object({
  user: userSchema,
});
