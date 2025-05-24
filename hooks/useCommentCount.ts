// useCommentCount.ts
import { serverUrl } from "@/lib/environment";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useCommentCount = (postId: string) => {
  const queryClient = useQueryClient();
  // Removed unused optimisticCount state

  const query = useQuery({
    queryKey: ["comment-count", postId],
    queryFn: async () => {
      const res = await fetch(`${serverUrl}/comments/count/${postId}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error('Failed to fetch comment count');
      
      const count = await res.json();
      return Number(count) as number;
    },
    staleTime: 1000 * 60 * 1 // 5 minutes
  });

  const updateCount = (adjustment: number) => {
    // Optimistically update the count
    queryClient.setQueryData(["comment-count", postId], 
      (old: number | undefined) => (old || 0) + adjustment
    );
  };

  return {
    count: query.data || 0,
    isLoading: query.isLoading,
    error: query.error,
    updateCount
  };
};