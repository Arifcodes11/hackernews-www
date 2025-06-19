"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { serverUrl } from "@/environment";

interface Like {
  id: string;
  createdAt: string;
  postId: string;
  post: {
    id: string;
    title: string;
  };
}

interface Props {
  likes: Like[];
}

export default function LikesSection({ likes: initialLikes }: Props) {
  const [likes, setLikes] = useState(initialLikes);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const router = useRouter();

  const deleteLike = async () => {
    if (!deleteTargetId) return;
    setDeletingId(deleteTargetId);
    try {
      const res = await fetch(`${serverUrl}/likes/${deleteTargetId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setLikes((prev) => prev.filter((like) => like.id !== deleteTargetId));
      }
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeletingId(null);
      setDeleteTargetId(null);
    }
  };

  if (!likes.length) return <p className="text-muted-foreground">No liked posts yet.</p>;

  return (
    <div className="space-y-3">
      {likes.map((like) => (
        <Card
          key={like.id}
          onClick={() => router.push(`/posts/${like.postId}`)}
          className="cursor-pointer hover:bg-accent transition-colors"
        >
          <CardContent className="p-4 flex justify-between items-start">
            <div>
              <p className="text-blue-600 dark:text-blue-400 font-medium">
                {like.post?.title || "Untitled Post"}
              </p>
              <p className="text-sm text-muted-foreground">
                Liked on: {new Date(like.createdAt).toLocaleDateString()}
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTargetId(like.id);
                  }}
                >
                  {deletingId === like.id ? (
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
                    This action will permanently delete your like. You can&apos;t undo this.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteTargetId(null)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={deleteLike}>
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
