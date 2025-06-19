
import { Suspense } from "react";
import SearchPageClient from "./SearchPageClient";
import { Spinner } from "@/components/ui/spinner";

const SearchPage = () => {
  return (
    <Suspense
      fallback={
        <div className="p-4 flex justify-center items-center h-[50vh]">
          <Spinner size={32} className="text-muted-foreground" />
        </div>
      }
    >
      <SearchPageClient />
    </Suspense>
  );
};

export default SearchPage;

