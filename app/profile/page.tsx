"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { apiResponseSchema } from "@/lib/extras/schemas/user";
import CommentCount from "../feeds/components/comment-post/CommentCount";
import LikeButton from "../feeds/components/like-post/LikeButton";
import DeleteButton from "../feeds/components/delete-post/DeletePostButton";
import CreatePost from "../feeds/components/create-post/CreatePost";
import { betterAuthClient } from "@/lib/integrations/better-auth";
import { EditProfileSheet } from "./EditProfile";
import { serverUrl } from "@/lib/environment";

const UserProfilePage = () => {
  const { data: sessionUser } = betterAuthClient.useSession();
  const router = useRouter();
  const { data, error, isLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await fetch(`${serverUrl}/profile/me`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          response.status === 401
            ? "Please login to view your profile"
            : `Failed to fetch user data: ${errorText || response.status}`
        );
      }

      const json = await response.json();

      try {
        const result = apiResponseSchema.parse(json);
        return result.user;
      } catch (validationError) {
        console.error("Validation error:", validationError);
        throw new Error("Invalid user data format from server");
      }
    },
  });

  const [activeTab, setActiveTab] = useState<
    "posts" | "likedPosts" | "commentedPosts"
  >("posts");

  if (error) {
    return (
      <Card className="max-w-3xl mx-auto my-10">
        <CardContent className="flex items-center justify-center text-destructive text-center py-6">
          {error.message}
        </CardContent>
        <CardFooter className="justify-center pb-6">
          <Button variant="outline" onClick={() => router.refresh()}>
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="max-w-3xl mx-auto my-10">
        <CardContent className="flex items-center justify-center py-6">
          <Spinner />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="max-w-3xl mx-auto my-10">
        <CardContent className="flex items-center justify-center py-6">
          No user data available
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Profile Section */}
      <Card className="mb-8 w-full px-4 sm:px-6 py-6 relative">
        <div className="absolute right-4 top-4 sm:top-1/2 sm:-translate-y-1/2">
          <EditProfileSheet user={data} />
        </div>

        <CardHeader className="flex flex-col sm:flex-row items-center sm:items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={data.image || "https://github.com/shadcn.png"}
              alt={data.name || "User"}
            />
            <AvatarFallback>
              {data.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-center sm:text-left">
            <CardTitle className="text-xl sm:text-2xl">
              {data.name
                ? data.name.charAt(0).toUpperCase() + data.name.slice(1)
                : "Anonymous User"}
            </CardTitle>
            {data.email && (
              <p className="text-muted-foreground text-sm">{data.email}</p>
            )}
            {data.createdAt && (
              <p className="text-muted-foreground text-sm">
                Joined on:{" "}
                {new Date(data.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent className="mt-4">
          {data.about ? (
            <p className="text-sm sm:text-base text-center sm:text-left">
              {data.about}
            </p>
          ) : (
            <p className="text-muted-foreground text-sm text-center sm:text-left">
              No bio provided
            </p>
          )}
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="mb-6 flex flex-col sm:flex-row gap-2 justify-center sm:justify-start">
        <Button
          className="rounded-full"
          variant={activeTab === "posts" ? "default" : "outline"}
          onClick={() => setActiveTab("posts")}
        >
          Created Posts
        </Button>
        <Button
          className="rounded-full"
          variant={activeTab === "likedPosts" ? "default" : "outline"}
          onClick={() => setActiveTab("likedPosts")}
        >
          Liked Posts
        </Button>
        <Button
          className="rounded-full"
          variant={activeTab === "commentedPosts" ? "default" : "outline"}
          onClick={() => setActiveTab("commentedPosts")}
        >
          Commented Posts
        </Button>
      </div>

      {/* Active Tab Content */}
      <div className="flex flex-col gap-4">
        {activeTab === "posts" && (
          <>
            <h2 className="mb-4 text-xl font-semibold">My Posts</h2>
            {data.posts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                  <p>You haven&apos;t created any posts yet</p>
                  {sessionUser?.user.id === data.id && <CreatePost />}
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col gap-4">
                {data.posts.map((post) => (
                  <Card
                    key={post.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors w-full"
                  >
                    <CardHeader>{post.title}</CardHeader>
                    <CardContent>
                      <p className="line-clamp-3">{post.text}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Created: {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <LikeButton postId={post.id} />
                        <div className="flex gap-2 items-center">
                          <span>Comments</span>
                          <span className="text-blue-600 cursor-pointer whitespace-nowrap">
                            <CommentCount postId={post.id} />
                          </span>
                        </div>
                      </div>
                      <DeleteButton postId={post.id} authorId={post.authorId} />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "likedPosts" && (
          <>
            <h2 className="mb-4 text-xl font-semibold">Liked Posts</h2>
            {data.likedPosts.length === 0 ? (
              <p>No posts liked yet</p>
            ) : (
              <div className="flex flex-col gap-4">
                {data.likedPosts.map((likedPost) => (
                  <Card key={likedPost.postId} className="p-2">
                    <CardHeader>{likedPost.title}</CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Liked at:{" "}
                        {new Date(likedPost.likedAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "commentedPosts" && (
          <>
            <h2 className="mb-4 text-xl font-semibold">Commented Posts</h2>
            {data.commentedPosts.length === 0 ? (
              <p>No posts commented on yet</p>
            ) : (
              <div className="flex flex-col gap-4">
                {data.commentedPosts.map((commentedPost) => (
                  <Card
                    className="p-2"
                    key={`${commentedPost.postId}-${commentedPost.commentedAt}`}
                  >
                    <CardHeader>{commentedPost.title}</CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Commented at:{" "}
                        {new Date(
                          commentedPost.commentedAt
                        ).toLocaleDateString()}
                      </p>
                      <p className="mt-2">{commentedPost.commentText}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
