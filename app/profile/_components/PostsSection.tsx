

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
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
import { serverUrl } from "@/environment";

interface Post {
  id: string;
  title: string;
  createdAt: string;
}

interface Props {
  posts: Post[];
}

export default function PostsSection({ posts: initialPosts }: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const confirmDeletePost = async () => {
    if (!deleteTargetId) return;

    setDeletingId(deleteTargetId);
    try {
      const res = await fetch(`${serverUrl}/posts/${deleteTargetId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((post) => post.id !== deleteTargetId));
      }
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeletingId(null);
      setDeleteTargetId(null);
    }
  };

  if (!posts.length) return <p className="text-muted-foreground">No posts yet.</p>;

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <Card
          key={post.id}
          onClick={() => router.push(`/posts/${post.id}`)}
          className="cursor-pointer hover:bg-accent transition-colors"
        >
          <CardContent className="p-4 flex justify-between items-start">
            <div>
              <p className="text-blue-600 dark:text-blue-400 font-medium">{post.title}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTargetId(post.id);
                  }}
                  disabled={deletingId === post.id}
                >
                  {deletingId === post.id ? (
                    <Spinner size={18} className="text-destructive" />
                  ) : (
                    <Trash2 className="w-5 h-5 text-destructive" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the post. You cannot undo this action.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDeletePost}>
                    Yes, delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
