"use client";

import React, { PropsWithChildren } from "react";
import { Toaster } from "@/components/ui/sonner";

const FeedLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <main className="min-h-screen">
        <div className="mx-auto mt-4 px-4 sm:px-6 lg:px-8 max-w-7xl">
          {children}
        </div>
      </main>
      <Toaster />
    </>
  );
};

export default FeedLayout;
