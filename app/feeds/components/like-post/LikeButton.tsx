"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { betterAuthClient } from "@/lib/integrations/better-auth";
import { serverUrl } from "@/lib/environment";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface LikeStatus {
  liked?: boolean; // Make liked optional
  count: number;
}

const LikeButton = ({ postId }: { postId: string }) => {
  const queryClient = useQueryClient();
  const { data: session } = betterAuthClient.useSession();
  const [isMounted, setIsMounted] = useState(false);

  // Determine if user is authenticated
  const isAuthenticated = !!session?.user?.id;

  // Fetch like status
  const { data, isLoading, isError } = useQuery<LikeStatus>({
    queryKey: ["likes", postId, isAuthenticated],
    queryFn: async () => {
      const url = `${serverUrl}/likes/${postId}`
       

      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch likes");
      }

      return res.json();
    },
    enabled: isMounted,
    retry: 1,
    staleTime: isAuthenticated ? 60_000 : 300_000,
  });

  // Like mutation
  const mutation = useMutation({
    mutationFn: async () => {
      if (!isAuthenticated) return;

      const method = data?.liked ? "DELETE" : "POST";
      const response = await fetch(`${serverUrl}/likes/${postId}`, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Action failed");
      }

      return response.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["likes", postId] });

      const previousData = queryClient.getQueryData<LikeStatus>(["likes", postId]);

      if (isAuthenticated) {
        queryClient.setQueryData<LikeStatus>(["likes", postId], (old) => ({
          liked: !old?.liked,
          count: old?.count ? (old.liked ? old.count - 1 : old.count + 1) : 0,
        }));
      }

      return { previousData };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["likes", postId], context?.previousData);
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", postId] });
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error("Please login to like this post");
      window.location.href = `/login?returnUrl=${encodeURIComponent(
        window.location.pathname
      )}`;
      return;
    }

    mutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 animate-pulse">
        <div className="w-6 h-6 bg-gray-200 rounded-full" />
        <div className="w-8 h-4 bg-gray-200 rounded" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-2 text-red-500">
        <HeartOutline className="w-6 h-6" />
        <span className="text-sm">Error loading likes</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {isAuthenticated ? (
        <button
          onClick={handleLike}
          disabled={mutation.isPending}
          className="relative transition-transform hover:scale-110"
          aria-label={data?.liked ? "Unlike post" : "Like post"}
        >
          {data?.liked ? (
            <HeartSolid className="w-6 h-6 text-red-500" />
          ) : (
            <HeartOutline className="w-6 h-6 text-gray-600 hover:text-red-400" />
          )}
          {mutation.isPending && (
            <div className="absolute inset-0 animate-ping rounded-full bg-red-100" />
          )}
        </button>
      ) : (
        <HeartOutline className="w-6 h-6 text-gray-400 cursor-default" />
      )}
      <span
        className={`text-sm font-medium ${
          data?.count ? "text-red-500" : "text-gray-500"
        }`}
      >
        {data?.count ?? 0}
      </span>
    </div>
  );
};

export default LikeButton;