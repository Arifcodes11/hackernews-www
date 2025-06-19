
"use client";

import React, { useState, useEffect } from "react";
import { betterAuthClient } from "@/lib/integrations/better-auth";
import { serverUrl } from "@/environment";
import { CreatePost } from "./_pages/CreatePost";
import PostList from "./_pages/PostsLists";

interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const RootPage = () => {
  const { data: session } = betterAuthClient.useSession();

  // Explicitly define the state type as Post[]
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${serverUrl}/posts`);
      const data = await res.json();

    
      if (Array.isArray(data)) {
        setPosts(data); 
      } else if (Array.isArray(data.posts)) {
        setPosts(data.posts); 
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setPosts([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="relative flex max-w-7xl mx-auto p-4 gap-6">
      <div className="flex-1">
      
        <PostList
          posts={posts}
          loading={loading}
          currentUserId={session?.user?.id || ""}
        />
      </div>

      {session && (
        <>
         
          <div className="fixed bottom-6 right-6 z-50 md:hidden">
            <CreatePost floating onPostCreated={fetchPosts} />
          </div>

         
          <div className="hidden md:block sticky top-20 h-fit">
            <CreatePost onPostCreated={fetchPosts} />
          </div>
        </>
      )}
    </div>
  );
};

export default RootPage;
