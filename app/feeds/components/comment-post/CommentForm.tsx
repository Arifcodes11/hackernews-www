"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { tanstackQueryClient } from "@/lib/integrations/tanstack-query";
import { betterAuthClient } from "@/lib/integrations/better-auth";
import { RoundSpinner} from "@/components/ui/spinner";
import { serverUrl } from "@/lib/environment";

interface CommentFormProps {
  postId: string;
}

const CommentForm = ({ postId }: CommentFormProps) => {
  const [content, setContent] = useState("");
  const { data: sessionUser } = betterAuthClient.useSession();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${serverUrl}/comments/${postId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to post comment");
      }

      return res.json();
    },
    onSuccess: (newComment) => {
      setContent("");

      // 🔥 Optimistically add comment to the cache
      tanstackQueryClient.setQueryData<Comment[]>(
        ["comments", postId],
        (oldComments = []) => [...oldComments, newComment]
      );
    },
  });
  

  return (
    <>
      {sessionUser && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="w-full max-w-3xl mx-auto flex flex-col md:flex-row items-stretch gap-2 px-4 py-3"
        >
          <input
            type="text"
            className="flex-1 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
          />
          <button
            type="submit"
            disabled={mutation.isPending || !content.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm md:w-auto w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? (
              <div className="flex items-center gap-2">
                <RoundSpinner />
                Commenting
              </div>
            ) : (
              "Comment"
            )}
          </button>
        </form>
      )}
    </>
  );
};

export default CommentForm;
