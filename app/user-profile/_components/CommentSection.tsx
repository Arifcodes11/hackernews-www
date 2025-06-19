"use client";

import { useRouter } from "next/navigation";

interface Comment {
  id: string;
  content: string;
  postId: string;
  postTitle: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  postContent?: string; // Marking postContent as optional
}

interface CommentSectionProps {
  comments: Comment[];
}

const CommentSection = ({ comments }: CommentSectionProps) => {
  const router = useRouter();

  const handlePostClick = (postId: string) => {
    router.push(`/posts/${postId}`);
  };

  const truncateContent = (content: string) => {
    // Truncate to 100 characters or less, if longer add ellipsis
    if (content.length > 100) {
      return content.substring(0, 100) + "...";
    }
    return content;
  };

  if (comments.length === 0) {
    return <div className="p-6 text-muted-foreground">User has not commented on any posts.</div>;
  }

  return (
    <div>
      {comments.map(comment => (
        <div
          key={comment.id}
          className="bg-muted rounded p-4 mb-4 cursor-pointer"
          onClick={() => handlePostClick(comment.postId)}
        >
          <p>{comment.content}</p>
          <p className="text-sm text-muted-foreground">
            Commented on &quot;{comment.postTitle}&quot;:{" "}
            {comment.postContent ? (
              <span className="font-medium">{truncateContent(comment.postContent)}</span>
            ) : (
              <span className="font-medium text-muted-foreground">No post content available</span>
            )}
          </p>
          <p className="text-sm text-muted-foreground">
            On {new Date(comment.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
