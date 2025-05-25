"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { feedSchema } from "@/lib/extras/schemas/post";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import CommentCount from "./components/comment-post/CommentCount";
import { serverUrl } from "@/lib/environment";
import LikeButton from "./components/like-post/LikeButton";
import DeleteButton from "./components/delete-post/DeletePostButton";
import CreatePost from "./components/create-post/CreatePost";
import { betterAuthClient } from "@/lib/integrations/better-auth";
import { Skeleton } from "@/components/ui/skeleton";

const FeedPage = () => {
  const router = useRouter();
  const { data: sessionUser } = betterAuthClient.useSession();
  const [page, setPage] = useState(1);
  const limit = 4;

  const { data, error, isPending } = useQuery({
    queryKey: ["feeds", page],
    queryFn: async () => {
      const url =  `${serverUrl}/feeds?page=${page}&limit=${limit}`
    
      
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();
      console.log(json);
      return feedSchema.parse(json);
    },
    placeholderData: keepPreviousData,
  });

  if (error) {
    console.log(error);
    return (
      <Card>
        <CardContent className="flex items-center justify-center text-destructive">
          Something went wrong! {error.message}
        </CardContent>
      </Card>
    );
  }

  if (isPending) {
    return (
      <div className="flex flex-col gap-4 max-w-4xl mx-auto px-4 mt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-12" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex flex-col items-stretch gap-4 max-w-4xl mx-auto px-4 ">
        <div className=" w-full flex items-start">
          {sessionUser && <CreatePost />}
        </div>
        {data.data.map((post) => (
          <Card
            key={post.id}
            className="w-full cursor-pointer  hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            <CardHeader className="relative group">
              <h2
                className="text-xl font-semibold cursor-pointer hover:underline underline-offset-4"
                onClick={() => router.push(`/posts/${post.id}`)}
              >
                {post.title}
              </h2>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground ">
                {post.text.length > 200
                  ? `${post.text.slice(0, 200)}...`
                  : post.text}
              </p>
              {post.text.length > 200 && (
                <button
                  onClick={() => router.push(`/posts/${post.id}`)}
                  className="text-[#3B82F6] hover:text-blue-700 hover:underline underline-offset-2 mt-2 inline-block text-sm"
                >
                  Read more
                </button>
              )}
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t ">
              <span
                className="text-xs text-muted-foreground order-first sm:order-none hover:text-[#3B82F6]"
                onClick={() => router.push(`/users-profile/${post.author.id}`)}
              >
                by {post.author.name}{" "}
              </span>
              <span className="text-xs text-muted-foreground order-first sm:order-none">
                {new Date(post.createdAt).toLocaleString()}
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-normal">
                <div className="flex items-center gap-2 sm:gap-4">
                  <LikeButton postId={post.id} />
                  <div className="flex">
                    <span
                      className="text-md text-[#3B82F6] hover:text-blue-700 hover:underline cursor-pointer whitespace-nowrap"
                      onClick={() => router.push(`/posts/${post.id}`)}
                    >
                      Comments
                    </span>
                    <CommentCount postId={post.id} />
                  </div>
                </div>
                <div className="sm:ml-4">
                  <DeleteButton postId={post.id} authorId={post.author.id} />
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-muted-foreground">Page {page}</span>

          <button
            onClick={() => {
              if (data && data.data.length === limit) {
                setPage((prev) => prev + 1);
              }
            }}
            disabled={!(data && data.data.length === limit)}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Floating Button injected here */}
    </div>
  );
};

export default FeedPage;
