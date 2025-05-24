import CommentForm from "@/app/feeds/components/comment-post/CommentForm";
import CommentList from "@/app/feeds/components/comment-post/CommentList";
import DeleteButton from "@/app/feeds/components/delete-post/DeletePostButton";
import LikeButton from "@/app/feeds/components/like-post/LikeButton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { serverUrl } from "@/lib/environment";
import { forwardableHeaders } from "@/lib/extras/headers";
import { postUserSchema } from "@/lib/extras/schemas/user";
import Link from "next/link";

import React from "react";

const PostPage = async ({
  params,
}: {
  params: Promise<{ postId: string }>;
}) => {
  const postId = (await params).postId;

  const response = await fetch(`${serverUrl}/posts/${postId}`, {
    method: "GET",
    headers:await forwardableHeaders()
  
  });

  const json = await response.json();
  const data = postUserSchema.parse(json);

  return (
    <>
      <div className="relative">
        <div className="flex flex-col items-stretch gap-4 max-w-4xl mx-auto px-4 pb-24">
          <Card
            key={data.id}
            className="w-full cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            <CardHeader className="relative group">
              <h2 className="text-xl font-semibold cursor-pointer ">
                {data.title}
              </h2>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">{data.text}</p>
            </CardContent>

            <Separator />

            <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
              <span className="text-xs text-muted-foreground order-first sm:order-none">
                by {data.author.name}
                <Link href={`/users-profile/${data.authorId}`}></Link>
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-normal">
                <div className="flex items-center gap-2 sm:gap-4">
                  <LikeButton postId={data.id} />
                </div>
                <div className="sm:ml-4">
                  <DeleteButton postId={data.id} authorId={data.author.id} />
                </div>
              </div>
            </CardFooter>
          </Card>

          <CommentForm postId={data.id} />
          <CommentList postId={data.id} />
        </div>
      </div>
    </>
  );
};
export default PostPage;
