"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { serverUrl } from "@/lib/environment";
import { betterAuthClient } from "@/lib/integrations/better-auth";
import { tanstackQueryClient } from "@/lib/integrations/tanstack-query";
import { Trash } from "lucide-react";
import { toast } from "sonner";


export  default function DeleteButton({
  postId,
  authorId,
}: {
  postId: string;
  authorId: string;
}) {
  const { data:userdata } = betterAuthClient.useSession();

  // Only show delete button if current user is the author
  if (!userdata || userdata.user.id !== authorId) {
    return null;
  }

  async function deletePost() {
      try {
        const response = await fetch(`${serverUrl}/feeds/${postId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to delete post");
        toast.success("Post deleted successfully");
        // Invalidate the feeds query to trigger refresh
        await tanstackQueryClient.invalidateQueries({
          queryKey: ["feeds"],
        });
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("Failed to delete post");

        // Handle error (e.g., show toast)
      }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash className="h-4 w-4 text-red-600" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your post
            and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={deletePost}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
