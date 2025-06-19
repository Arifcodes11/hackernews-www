// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { Card } from "@/components/ui/card";
// import { serverUrl } from "@/environment";

// type Post = {
//   id: string;
//   title: string;
//   content: string;
//   author: {
//     id: string;
//     name: string;
//     image: string | null;
//   };
// };

// const SearchPageClient = () => {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const query = searchParams.get("q") || "";
//   const [results, setResults] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const searchPosts = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`${serverUrl}/search?q=${query}&limit=20`);
//         const json = await res.json();
//         setResults(json.data || []);
//       } catch (error) {
//         console.error("Search failed:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (query.trim()) {
//       searchPosts();
//     }
//   }, [query]);

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-24">
//       <h1 className="text-2xl font-bold mb-6">
//         Search Results for &quot;{query}&quot;
//       </h1>
//       {loading ? (
//         <p>Loading...</p>
//       ) : results.length === 0 ? (
//         <p>No results found.</p>
//       ) : (
//         <div className="space-y-4">
//           {results.map((post) => (
//             <Card
//               key={post.id}
//               className="p-4 cursor-pointer hover:bg-muted transition"
//               onClick={() => router.push(`/posts/${post.id}`)}
//             >
//               <h2 className="text-lg font-semibold mb-1">{post.title}</h2>
//               <p className="text-sm text-muted-foreground line-clamp-3">
//                 {post.content}
//               </p>
//               <div className="text-xs mt-2 text-muted-foreground">
//                 By {post.author.name}
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchPageClient;



"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { serverUrl } from "@/environment";
import { Spinner } from "@/components/ui/spinner";

type Post = {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
};

const SearchPageClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${serverUrl}/search?q=${query}&limit=20`);
        const json = await res.json();
        setResults(json.data || []);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query.trim()) {
      searchPosts();
    }
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <h1 className="text-2xl font-bold mb-6">
        Search Results for &quot;{query}&quot;
      </h1>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner className="text-muted-foreground" size={32} />
        </div>
      ) : results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="space-y-4">
          {results.map((post) => (
            <Card
              key={post.id}
              className="p-4 cursor-pointer hover:bg-muted transition"
              onClick={() => router.push(`/posts/${post.id}`)}
            >
              <h2 className="text-lg font-semibold mb-1">{post.title}</h2>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {post.content}
              </p>
              <div className="text-xs mt-2 text-muted-foreground">
                By {post.author.name}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPageClient;
