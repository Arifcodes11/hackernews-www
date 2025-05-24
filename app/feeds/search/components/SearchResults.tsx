"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { serverUrl } from "@/lib/environment";
import { Skeleton } from "@/components/ui/skeleton";

import { z } from "zod";
import { postSchema } from "@/lib/extras/schemas/searchSchema";

// Infer the Post type from Zod schema
type Post = z.infer<typeof postSchema>;

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery<{
    posts: Post[];
    summary: string;
  }>({
    queryKey: ["search", query],
    queryFn: async () => {
      const res = await fetch(
        `${serverUrl}/feeds/search?q=${encodeURIComponent(query)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to fetch search results");
      const result = await res.json();

      console.log("Fetched data:", result);

      return {
        // Validate with schema if you want:
        // posts: z.array(postSchema).parse(result.data),
        posts: result.data,
        summary: result.summary,
      };
    },
    enabled: !!query,
  });

  if (!query) return <p className="text-gray-500">No query provided.</p>;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 border rounded shadow">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-3 w-1/3 mt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    console.error("Error:", error);
    return <p className="text-red-500">Error loading search results.</p>;
  }

  if (!data?.posts?.length) {
    return <p className="text-gray-500">No posts found.</p>;
  }

  return (
    <>
      {data.summary && (
        <div className="p-4 border rounded shadow bg-gray-100 dark:bg-gray-800 space-y-2">
          <h2 className="text-lg font-semibold">Summary</h2>
          {data.summary.split("\n").map((line, idx) => {
            const trimmed = line.trim().replace(/\*\*/g, ""); // Remove "**"
            if (!trimmed) return null;

            if (/^[A-Z]/.test(trimmed) && trimmed.endsWith(":")) {
              return (
                <h3
                  key={idx}
                  className="font-semibold text-gray-800 dark:text-gray-200 mt-2"
                >
                  {trimmed.slice(0, -1)}
                </h3>
              );
            }

            return (
              <p key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                {trimmed}
              </p>
            );
          })}
        </div>
      )}

      {data.posts.map((post: Post) => (
        <div
          key={post.id}
          className="p-4 border rounded shadow cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900"
          onClick={() => router.push(`/posts/${post.id}`)}
        >
          <h2 className="text-lg font-semibold hover:underline">
            {post.title}
          </h2>
          <p className="text-sm text-gray-600 mt-1">{post.text}</p>
          <div className="text-xs text-gray-500 mt-2">
            By {post.author?.toString.name ?? "Unknown Author"} on{" "}
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
      ))}
    </>
  );
}
