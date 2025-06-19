// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { serverUrl } from "@/environment";
// import { betterAuthClient } from "@/lib/integrations/better-auth";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Spinner } from "@/components/ui/spinner";
// import { FileText, MessageSquare, Heart, UserIcon } from "lucide-react";
// import PostsSection from "./_components/PostsSection";
// import CommentsSection from "./_components/CommentsSection";
// import LikesSection from "./_components/LikesSection";
// import { Button } from "@/components/ui/button";

// interface Post {
//   id: string;
//   title: string;
//   createdAt: string;
// }

// interface Comment {
//   id: string;
//   content: string;
//   createdAt: string;
//   postId: string;
//   post: {
//     id: string;
//     title: string;
//   };
// }

// interface Like {
//   id: string;
//   createdAt: string;
//   postId: string;
//   post: {
//     id: string;
//     title: string;
//   };
// }

// interface UserData {
//   user: {
//     id: string;
//     username: string;
//     name: string;
//     about: string;
//     createdAt: string;
//     posts: Post[];
//     comments: Comment[];
//     likes: Like[];
//   };
// }

// export default function ProfilePage() {
//   const { data } = betterAuthClient.useSession();
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [view, setView] = useState<"posts" | "comments" | "likes">("posts");

//   const fetchUserInfo = useCallback(async () => {
//     if (!data?.user?.id) return;
//     try {
//       const res = await fetch(`${serverUrl}/users/me`, {
//         method: "GET",
//         credentials: "include",
//       });
//       const json = await res.json();
//       if (res.ok) setUserData(json);
//     } catch (err) {
//       console.error("Failed to fetch user data:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [data?.user?.id]);

//   useEffect(() => {
//     fetchUserInfo();
//   }, [fetchUserInfo]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spinner size={32} className="text-primary" />
//       </div>
//     );
//   }

//   if (!data?.user || !userData) {
//     return (
//       <div className="p-6 text-center text-red-600 dark:text-red-400">
//         You must be logged in to view this page.
//       </div>
//     );
//   }

//   const { username, name, about, createdAt, posts, comments, likes } = userData.user;

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
//             <UserIcon className="w-6 h-6" />
//             Your Profile
//           </CardTitle>
//           <CardDescription>Welcome back, {username}!</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-2 text-sm">
//           <p><span className="font-semibold">Name:</span> {name || "N/A"}</p>
//           <p><span className="font-semibold">About:</span> {about || "No about section provided."}</p>
//           <p><span className="font-semibold">Joined:</span> {new Date(createdAt).toLocaleDateString()}</p>
//           <div className="flex gap-4 mt-4 text-muted-foreground">
//             <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> Posts: {posts.length}</span>
//             <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> Comments: {comments.length}</span>
//             <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> Likes: {likes.length}</span>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Styled Toggle Buttons */}
//       <div className="flex justify-center gap-4">
//         <Button
//           variant={view === "posts" ? "default" : "outline"}
//           onClick={() => setView("posts")}
//           className="rounded-full px-6"
//         >
//           Created Posts
//         </Button>
//         <Button
//           variant={view === "comments" ? "default" : "outline"}
//           onClick={() => setView("comments")}
//           className="rounded-full px-6"
//         >
//           Commented Posts
//         </Button>
//         <Button
//           variant={view === "likes" ? "default" : "outline"}
//           onClick={() => setView("likes")}
//           className="rounded-full px-6"
//         >
//           Liked Posts
//         </Button>
//       </div>

//       {/* Dynamic Section Rendering */}
//       <div>
//         {view === "posts" && <PostsSection posts={posts} />}
//         {view === "comments" && <CommentsSection comments={comments} />}
//         {view === "likes" && <LikesSection likes={likes} />}
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState, useCallback } from "react";
import { serverUrl } from "@/environment";
import { betterAuthClient } from "@/lib/integrations/better-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { FileText, MessageSquare, Heart, UserIcon } from "lucide-react";
import PostsSection from "./_components/PostsSection";
import CommentsSection from "./_components/CommentsSection";
import LikesSection from "./_components/LikesSection";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  title: string;
  createdAt: string;
}

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

interface Like {
  id: string;
  createdAt: string;
  postId: string;
  post: {
    id: string;
    title: string;
  };
}

interface UserData {
  user: {
    id: string;
    username: string;
    name: string;
    about: string;
    createdAt: string;
    posts: Post[];
    comments: Comment[];
    likes: Like[];
  };
}

export default function ProfilePage() {
  const { data } = betterAuthClient.useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"posts" | "comments" | "likes">("posts");

  const fetchUserInfo = useCallback(async () => {
    if (!data?.user?.id) return;
    try {
      const res = await fetch(`${serverUrl}/users/me`, {
        method: "GET",
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok) setUserData(json);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    } finally {
      setLoading(false);
    }
  }, [data?.user?.id]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size={32} className="text-primary" />
      </div>
    );
  }

  if (!data?.user || !userData) {
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-400">
        You must be logged in to view this page.
      </div>
    );
  }

  const { username, name, about, createdAt, posts, comments, likes } =
    userData.user;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <UserIcon className="w-6 h-6" />
            Your Profile
          </CardTitle>
          <CardDescription>Welcome back, {username}!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">Name:</span> {name || "N/A"}
          </p>
          <p>
            <span className="font-semibold">About:</span>{" "}
            {about || "No about section provided."}
          </p>
          <p>
            <span className="font-semibold">Joined:</span>{" "}
            {new Date(createdAt).toLocaleDateString()}
          </p>
          <div className="flex gap-4 mt-4 text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4" /> Posts: {posts.length}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" /> Comments: {comments.length}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" /> Likes: {likes.length}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Responsive Toggle Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button
          variant={view === "posts" ? "default" : "outline"}
          onClick={() => setView("posts")}
          className="w-full sm:w-auto rounded-full px-6"
        >
          Created Posts
        </Button>
        <Button
          variant={view === "comments" ? "default" : "outline"}
          onClick={() => setView("comments")}
          className="w-full sm:w-auto rounded-full px-6"
        >
          Commented Posts
        </Button>
        <Button
          variant={view === "likes" ? "default" : "outline"}
          onClick={() => setView("likes")}
          className="w-full sm:w-auto rounded-full px-6"
        >
          Liked Posts
        </Button>
      </div>

      {/* Dynamic Section Rendering */}
      <div>
        {view === "posts" && <PostsSection posts={posts} />}
        {view === "comments" && <CommentsSection comments={comments} />}
        {view === "likes" && <LikesSection likes={likes} />}
      </div>
    </div>
  );
}
