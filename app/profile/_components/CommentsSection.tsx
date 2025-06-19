"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { serverUrl } from "@/environment";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  postId: string;
  post: {
    id: string;
    title: string;
  };
}

interface Props {
  comments: Comment[];
}

export default function CommentsSection({ comments: initialComments }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null); // State to track the comment to delete
  const router = useRouter();

  const deleteComment = async () => {
    if (!deleteTargetId) return;
    setDeletingId(deleteTargetId);
    try {
      const res = await fetch(`${serverUrl}/comments/${deleteTargetId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== deleteTargetId));
      }
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeletingId(null);
      setDeleteTargetId(null);
    }
  };

  if (!comments.length) return <p className="text-muted-foreground">No commented posts yet.</p>;

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <Card
          key={comment.id}
          onClick={() => router.push(`/posts/${comment.postId}`)}
          className="cursor-pointer hover:bg-accent transition-colors"
        >
          <CardContent className="p-4 flex justify-between items-start gap-4">
            <div className="space-y-1 max-w-[90%]">
              <p className="text-sm text-foreground break-words">{comment.content}</p>
              <p className="text-xs text-muted-foreground">Commented on: {new Date(comment.createdAt).toLocaleDateString()}</p>
              <p className="text-xs text-muted-foreground">
                {/* Displaying the title of the post the comment was made on */}
                Post: <span className="text-blue-600 dark:text-blue-400 font-medium">{comment.post?.title || "Untitled Post"}</span>
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTargetId(comment.id); // Set the comment ID to delete
                  }}
                >
                  {deletingId === comment.id ? (
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
                    This action will permanently delete your comment. You can&apos;t undo this.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteTargetId(null)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={deleteComment}>
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
