
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { serverUrl } from "@/lib/environment";
import React from "react";
import LikeButton from "@/app/feeds/components/like-post/LikeButton";
import DeleteButton from "@/app/feeds/components/delete-post/DeletePostButton";
import { apiResponseSchema } from "@/lib/extras/schemas/user";
import { forwardableHeaders } from "@/lib/extras/headers";



const ProfilePage = async ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  const userId = (await params).userId;

  const response = await fetch(`${serverUrl}/users-profile/${userId}`, {
    method: "GET",
   headers:await forwardableHeaders()
  });

  const json = await response.json();
  const data = apiResponseSchema.parse(json);
  

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Profile Section */}
      <Card className="mb-8 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 hover:bg-gray-50 dark:hover:bg-gray-950">
        <CardHeader className="flex flex-col items-center sm:flex-row sm:items-center gap-4">
          <Avatar className="h-16 w-16 mx-auto sm:mx-0">
            <AvatarImage
              src={data.user.image || "https://github.com/shadcn.png"}
              alt={data.user.name || "User"}
            />
            <AvatarFallback>
              {data.user.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div className=" flex flex-col text-center sm:text-left">
            <CardTitle className="text-xl sm:text-2xl">
              {data.user.name || "Anonymous User"}
            </CardTitle>
            {data.user.email && (
              <p className="text-muted-foreground text-sm">{data.user.email}</p>
            )}
          </div>
        </CardHeader>

        <CardContent className="mt-4">
          {data.user.about ? (
            <p className="text-sm sm:text-base text-center sm:text-left">
              {data.user.about}
            </p>
          ) : (
            <p className="text-muted-foreground text-sm text-center sm:text-left">
              No bio provided
            </p>
          )}
        </CardContent>
      </Card>

      {/* Posts Section */}
      <h2 className="mb-4 text-xl font-semibold">My Posts</h2>
      {data.user.posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
            <p>You haven&apos;t created any posts yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {data.user.posts.map((post) => (
            <Card
              key={post.id}
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors w-full"
            >
              <CardHeader>{post.title}</CardHeader>
              <CardContent>
                <p className="line-clamp-3">{post.text}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Created: {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ">
                {/* <span
                  className="text-xs text-muted-foreground order-first sm:order-none"
                  onClick={() => router.push(`/users`)}
                >
                  by {post.author.name}
                </span> */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-normal">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <LikeButton postId={post.id} />
                  </div>
                  <div className="sm:ml-4">
                    <DeleteButton postId={post.id} authorId={post.authorId} />
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
