// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { serverUrl } from "@/environment";
// import { Card, CardHeader, CardContent } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Button } from "@/components/ui/button";
// import PostSection from "../_components/PostSection";
// import CommentSection from "../_components/CommentSection";
// import LikeSection from "../_components/LikeSection";
// import { Spinner } from "@/components/ui/spinner"; // ✅ import Spinner

// export interface UserDetails {
//   user: {
//     id: string;
//     username: string;
//     name: string;
//     about: string;
//     createdAt: string;
//     updatedAt: string;
//     postsCount: number;
//     commentsCount: number;
//     likesCount: number;
//     posts: {
//       id: string;
//       title: string;
//       content: string;
//       createdAt: string;
//       updatedAt: string;
//       userId: string;
//     }[];
//     comments: {
//       id: string;
//       content: string;
//       postId: string;
//       postTitle: string;
//       createdAt: string;
//       updatedAt: string;
//       userId: string;
//     }[];
//     likedPosts: {
//       id: string;
//       title: string;
//       content: string;
//       createdAt: string;
//       updatedAt: string;
//       userId: string;
//     }[];
//   };
// }

// const UserProfilePage = () => {
//   const { id } = useParams();
//   const [user, setUser] = useState<UserDetails["user"] | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedView, setSelectedView] = useState<'posts' | 'comments' | 'likes'>('posts');

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await fetch(`${serverUrl}/users/${id}`, {
//           credentials: "include",
//         });
//         if (!res.ok) throw new Error("Failed to fetch user.");
//         const data = await res.json();
//         setUser(data.user);
//       } catch (err) {
//         setError((err as Error).message || "Something went wrong");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUser();
//   }, [id]);

//   if (isLoading)
//     return (
//       <div className="p-6 flex justify-center items-center text-muted-foreground">
//         <Spinner size={32} />
//       </div>
//     );

//   if (error) return <div className="p-6 text-destructive">Error: {error}</div>;
//   if (!user) return <div className="p-6 text-destructive">User not found.</div>;

//   return (
//     <Card className="max-w-2xl mx-auto mt-8">
//       <CardHeader>
//         <h1 className="text-2xl font-bold text-primary">@{user.username}</h1>
//         <p className="text-muted-foreground text-sm">{user.name}</p>
//         <p className="text-muted-foreground text-sm mt-2">
//           Joined on{" "}
//           {new Date(user.createdAt).toLocaleDateString("en-IN", {
//             year: "numeric",
//             month: "short",
//             day: "numeric",
//           })}
//         </p>
//       </CardHeader>
//       <Separator />
//       <CardContent className="space-y-4 mt-4">
//         {user.about && (
//           <div>
//             <h3 className="font-semibold text-lg">About</h3>
//             <p className="text-muted-foreground">{user.about}</p>
//           </div>
//         )}

//         <div className="grid grid-cols-3 gap-4 mt-4">
//           <Button
//             variant={selectedView === 'posts' ? 'default' : 'outline'}
//             onClick={() => setSelectedView('posts')}
//           >
//             Created Posts
//           </Button>
//           <Button
//             variant={selectedView === 'comments' ? 'default' : 'outline'}
//             onClick={() => setSelectedView('comments')}
//           >
//             Commented Posts
//           </Button>
//           <Button
//             variant={selectedView === 'likes' ? 'default' : 'outline'}
//             onClick={() => setSelectedView('likes')}
//           >
//             Liked Posts
//           </Button>
//         </div>

//         <div className="mt-4">
//           {selectedView === 'posts' && <PostSection posts={user.posts} />}
//           {selectedView === 'comments' && <CommentSection comments={user.comments} />}
//           {selectedView === 'likes' && <LikeSection likedPosts={user.likedPosts} />}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default UserProfilePage;




"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { serverUrl } from "@/environment";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import PostSection from "../_components/PostSection";
import CommentSection from "../_components/CommentSection";
import LikeSection from "../_components/LikeSection";
import { Spinner } from "@/components/ui/spinner";

export interface UserDetails {
  user: {
    id: string;
    username: string;
    name: string;
    about: string;
    createdAt: string;
    updatedAt: string;
    postsCount: number;
    commentsCount: number;
    likesCount: number;
    posts: {
      id: string;
      title: string;
      content: string;
      createdAt: string;
      updatedAt: string;
      userId: string;
    }[];
    comments: {
      id: string;
      content: string;
      postId: string;
      postTitle: string;
      createdAt: string;
      updatedAt: string;
      userId: string;
    }[];
    likedPosts: {
      id: string;
      title: string;
      content: string;
      createdAt: string;
      updatedAt: string;
      userId: string;
    }[];
  };
}

const UserProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState<UserDetails["user"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'posts' | 'comments' | 'likes'>('posts');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${serverUrl}/users/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch user.");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        setError((err as Error).message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (isLoading)
    return (
      <div className="p-6 flex justify-center items-center text-muted-foreground">
        <Spinner size={32} />
      </div>
    );

  if (error) return <div className="p-6 text-destructive">Error: {error}</div>;
  if (!user) return <div className="p-6 text-destructive">User not found.</div>;

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <h1 className="text-2xl font-bold text-primary">@{user.username}</h1>
        <p className="text-muted-foreground text-sm">{user.name}</p>
        <p className="text-muted-foreground text-sm mt-2">
          Joined on{" "}
          {new Date(user.createdAt).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4 mt-4">
        {user.about && (
          <div>
            <h3 className="font-semibold text-lg">About</h3>
            <p className="text-muted-foreground">{user.about}</p>
          </div>
        )}

        {/* Responsive Button Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <Button
            variant={selectedView === 'posts' ? 'default' : 'outline'}
            onClick={() => setSelectedView('posts')}
          >
            Created Posts
          </Button>
          <Button
            variant={selectedView === 'comments' ? 'default' : 'outline'}
            onClick={() => setSelectedView('comments')}
          >
            Commented Posts
          </Button>
          <Button
            variant={selectedView === 'likes' ? 'default' : 'outline'}
            onClick={() => setSelectedView('likes')}
          >
            Liked Posts
          </Button>
        </div>

        <div className="mt-4">
          {selectedView === 'posts' && <PostSection posts={user.posts} />}
          {selectedView === 'comments' && <CommentSection comments={user.comments} />}
          {selectedView === 'likes' && <LikeSection likedPosts={user.likedPosts} />}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfilePage;
