"use client";

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import clsx from "clsx";

export const SearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      router.push(
        `/feeds/search?q=${encodeURIComponent(debouncedQuery.trim())}`
      );
    } else {
      router.push("/feeds");
    }
  }, [debouncedQuery, router]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="transition-all duration-300 w-full sm:w-auto"
    >
      <Input
        placeholder="Search posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={clsx(
          "transition-all duration-300",
          "border border-blue-400",
          "w-full",
          isHovered ? "sm:w-96" : "sm:w-64"
        )}
      />
    </div>
  );
};
