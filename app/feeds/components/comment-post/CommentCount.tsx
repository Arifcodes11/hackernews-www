// CommentCount.tsx
import { useCommentCount } from "@/hooks/useCommentCount";


const CommentCount = ({ postId }: { postId: string }) => {

  const { count } = useCommentCount(postId);

  if (count === 0) return null;

  return (
    <span className="text-md text-blue mx-2 flex gap-1">
      
      <span>{count}</span>
    </span>
  );
};

export default CommentCount;
