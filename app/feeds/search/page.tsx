import React, { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import SearchResults from "./components/SearchResults"; // Ensure relative import

export default function SearchPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Search Results</h1>
      <Suspense
        fallback={
          <div className="flex justify-center p-8">
            <Spinner className="h-8 w-8" />
          </div>
        }
      >
        <SearchResults />
      </Suspense>
    </div>
  );
}