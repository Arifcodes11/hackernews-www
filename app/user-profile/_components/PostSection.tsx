import { useRouter } from "next/navigation";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface PostSectionProps {
  posts: Post[];
}

const PostSection = ({ posts }: PostSectionProps) => {
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

  if (posts.length === 0) {
    return <div className="p-6 text-muted-foreground">User has not posted anything.</div>;
  }

  return (
    <div>
      {posts.map(post => (
        <div
          key={post.id}
          className="bg-muted rounded p-4 mb-4 cursor-pointer"
          onClick={() => handlePostClick(post.id)}
        >
          <h4 className="font-semibold text-lg">{post.title}</h4>
          <p>{truncateContent(post.content)}</p>
          <p className="text-sm text-muted-foreground">
            Posted on {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PostSection;
