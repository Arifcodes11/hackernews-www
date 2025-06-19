"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Comment } from "@/lib/extras/schemas/comment";
import { useState } from "react";
import { betterAuthClient } from "@/lib/integrations/better-auth";
import { RoundSpinner, Spinner } from "@/components/ui/spinner";
import { serverUrl } from "@/lib/environment";

interface Props {
  postId: string;
}

const CommentList = ({ postId }: Props) => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: sessionUser } = betterAuthClient.useSession();



  const {
    data: comments,
    isLoading,
    error: fetchError,
    isError,
  } = useQuery<Comment[]>({
    queryKey: ["comments", postId,sessionUser],
    queryFn: async () => {
      const res = await fetch(`${serverUrl}/comments/${postId}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch comments");
      }

      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const res = await fetch(`${serverUrl}/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete comment");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => {
      const res = await fetch(`${serverUrl}/comments/${commentId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update comment");
      }

      return res.json();
    },
    onSuccess: () => {
      setEditingId(null);
      setEditContent("");
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Spinner size={50} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded text-center">
        Error loading comments: {fetchError.message}
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto px-4">
      {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {!comments || comments.length === 0 ? (
        <p className="text-gray-500 text-center">No comments yet.</p>
      ) : (
        comments.map((comment) => {
          const isAuthor = sessionUser?.user.id === comment.user.id;

          return (
            <div key={comment.id} className="space-y-1">
              {editingId === comment.id ? (
                <>
                  <textarea
                    className="w-full min-h-[80px] border p-2 rounded text-sm resize-y"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    disabled={editMutation.isPending}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                      onClick={() =>
                        editMutation.mutate({
                          commentId: comment.id,
                          content: editContent,
                        })
                      }
                      disabled={editMutation.isPending}
                    >
                      {editMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <RoundSpinner />
                          Saving...
                        </div>
                      ) : (
                        "Save"
                      )}
                    </button>
                    <button
                      className="px-4 py-1.5 bg-gray-500 hover:bg-gray-300 text-sm rounded"
                      onClick={() => setEditingId(null)}
                      disabled={editMutation.isPending}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div>
                  <div className="text-m font-extrabold  text-gray-800 dark:text-gray-100">
                    {comment.user.name}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-200 break-words">
                    {comment.content}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </div>
                  {isAuthor && (
                    <div className="flex gap-4 mt-1 text-xs text-blue-600">
                      <button
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditContent(comment.content);
                        }}
                        className="hover:underline"
                        disabled={deleteMutation.isPending}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(comment.id)}
                        className="hover:underline text-red-500 disabled:opacity-50"
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? (
                          <div className="flex items-center gap-2">
                            <RoundSpinner />
                            Deleting...
                          </div>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default CommentList;
