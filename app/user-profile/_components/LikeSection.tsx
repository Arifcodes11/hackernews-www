import { useRouter } from "next/navigation";

interface LikedPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface LikeSectionProps {
  likedPosts: LikedPost[];
}

const LikeSection = ({ likedPosts }: LikeSectionProps) => {
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

  if (likedPosts.length === 0) {
    return <div className="p-6 text-muted-foreground">User has not liked any posts.</div>;
  }

  return (
    <div>
      {likedPosts.map(post => (
        <div
          key={post.id}
          className="bg-muted rounded p-4 mb-4 cursor-pointer"
          onClick={() => handlePostClick(post.id)}
        >
          <h4 className="font-semibold text-lg">{post.title}</h4>
          <p>{truncateContent(post.content)}</p>
          <p className="text-sm text-muted-foreground">
            Liked on {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default LikeSection;
