"use client";

import { PropsWithChildren } from "react";
import "./globals.css";
import { Inter } from "next/font/google";
// Metadata is a server-only export, so it needs to be imported conditionally or removed if layout is client component
// import { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TanstackQueryClientProvider } from "@/components/providers/tanstack-query-client-provider";
import { Toaster } from "@/components/ui/sonner";
import NavigationBar from "@/components/ui/NavigationBar";
import { usePathname } from "next/navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// If you need Metadata, consider moving it to a server component that wraps this client component layout.
// export const metadata: Metadata = {
//   title: "Insight360",
//   description:
//     "Breaking barriers in news—tech, trends, and world affairs delivered with depth and clarity.",
// };

const RootLayout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/log-in") || pathname.startsWith("/sign-up");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TanstackQueryClientProvider>
            <main className="min-h-screen">
              {!isAuthPage && <NavigationBar />}
              <div className="mx-auto mt-4 px-4 sm:px-6 lg:px-8 max-w-7xl">
                {children}
              </div>
            </main>
            <Toaster />
          </TanstackQueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
