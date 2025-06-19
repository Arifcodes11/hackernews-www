"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { serverUrl } from "@/environment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Trash2, Edit3 } from "lucide-react";
import { betterAuthClient } from "@/lib/integrations/better-auth";

interface CommentsProps {
  postId: string;
}

interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
  postId: string | null;
}

const Comments = ({ postId }: CommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState<number>(0);
  const [content, setContent] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const { data } = betterAuthClient.useSession();
  const currentUserId = data?.user?.id ?? null;

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${serverUrl}/comments/on/${postId}`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
        setCommentsCount(data.comments.length);
      }
    } catch {
      console.error("Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async () => {
    if (!currentUserId) return router.push("/login");

    try {
      const response = await fetch(`${serverUrl}/comments/on/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
      });

      if (response.status === 401) return router.push("/login");

      if (response.ok) {
        setContent("");
        fetchComments();
      }
    } catch {
      console.error("Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!currentUserId) return router.push("/login");

    try {
      const response = await fetch(`${serverUrl}/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.status === 401) return router.push("/login");

      if (response.ok) {
        setComments((prev) => prev.filter((comment) => comment.id !== commentId));
        setCommentsCount((prev) => prev - 1);
      }
    } catch {
      console.error("Failed to delete comment");
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!currentUserId) return router.push("/login");

    setSaving(true);
    try {
      const response = await fetch(`${serverUrl}/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: editedContent }),
      });

      if (response.status === 401) return router.push("/login");

      if (response.ok) {
        setEditingCommentId(null);
        setEditedContent("");
        fetchComments();
      }
    } catch {
      console.error("Failed to edit comment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          if (!showComments) fetchComments();
          setShowComments(!showComments);
        }}
      >
        {showComments ? "Hide Comments" : "Show Comments"} ({commentsCount})
      </Button>

      {showComments && (
        <div className="mt-3 space-y-3">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Write a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button onClick={handleAddComment}>Comment</Button>
          </div>

          {loading ? (
            <div className="flex justify-center mt-4">
              <Spinner size={20} className="text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-2">
              {comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="p-3 flex justify-between items-start gap-3">
                    <div className="space-y-1 w-full">
                      {editingCommentId === comment.id ? (
                        <>
                          <Input
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                          />
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              onClick={() => handleEditComment(comment.id)}
                              disabled={saving}
                            >
                              {saving ? (
                                <Spinner size={16} className="text-muted-foreground" />
                              ) : (
                                "Save"
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingCommentId(null);
                                setEditedContent("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <Link
                            href={`/user-profile/${comment.userId}`}
                            className="text-sm font-medium text-blue-600 hover:underline"
                          >
                            {comment.userName}
                          </Link>
                          <p className="text-sm">{comment.content}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleString()}
                          </p>
                        </>
                      )}
                    </div>

                    {currentUserId === comment.userId &&
                      editingCommentId !== comment.id && (
                        <div className="flex flex-col gap-1 items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingCommentId(comment.id);
                              setEditedContent(comment.content);
                            }}
                          >
                            <Edit3 className="w-4 h-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;
