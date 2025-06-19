"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Likes from "@/app/_pages/likes";
import Comments from "@/app/_pages/comments";
import { serverUrl } from "@/environment";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { betterAuthClient } from "@/lib/integrations/better-auth";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";

interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    name: string;
  };
}

const PostPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data } = betterAuthClient.useSession();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${serverUrl}/posts/${id}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch post.");
        const data = await response.json();
        setPost(data.post);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const deletePost = async () => {
    if (!post) return;
    setDeleting(true);
    try {
      const res = await fetch(`${serverUrl}/posts/${post.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        router.push("/");
      } else {
        throw new Error("Failed to delete post.");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center text-muted-foreground">
        <Spinner size={32} />
      </div>
    );
  }

  if (error) return <div className="p-6 text-destructive">Error: {error}</div>;
  if (!post) return <div className="p-6 text-destructive">Post not found.</div>;

  const isAuthor = data?.user.id === post.userId;

  return (
    <Card className="max-w-3xl mx-auto mt-6">
      <CardHeader className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">{post.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Posted by{" "}
            <span
              className="font-medium text-blue-600 hover:underline cursor-pointer"
              onClick={() => router.push(`/user-profile/${post.user.id}`)}
            >
              {post.user.username}
            </span>{" "}
            on{" "}
            {new Date(post.createdAt).toLocaleString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
              timeZone: "Asia/Kolkata",
            })}
          </p>
        </div>

        {isAuthor && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" title="Delete Post">
                <Trash2 className="w-5 h-5 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will permanently delete your post. You can&apos;t undo this.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deletePost}>
                  {deleting ? <Spinner size={20} /> : "Yes, delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardHeader>

      <Separator />

      <CardContent className="space-y-6 pt-6 pb-2">
        <p className="text-base text-foreground whitespace-pre-line">
          {post.content}
        </p>

        <div className="flex items-center gap-4">
          <Likes postId={post.id} />
        </div>

        <div className="mt-4">
          <Comments postId={post.id} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PostPage;
