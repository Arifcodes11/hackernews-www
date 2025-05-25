// RootLayout.tsx
"use client";

import { PropsWithChildren } from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TanstackQueryClientProvider } from "@/components/providers/tanstack-query-client-provider";
import { Toaster } from "@/components/ui/sonner";
import NavigationBar from "@/components/ui/NavigationBar";
import { betterAuthClient } from "@/lib/integrations/better-auth";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Intelliview",
  description: "Breaking barriers in news—tech, trends, and world affairs delivered with depth and clarity.",
};

const RootLayout = ({ children }: PropsWithChildren) => {
  const { data, isLoading } = betterAuthClient.useSession();

  // Wait until auth is ready to prevent layout flash
  if (isLoading) return null;

  const isLoggedIn = Boolean(data?.user);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TanstackQueryClientProvider>
            <main className="min-h-screen">
              {/* ✅ Show Navbar only when logged in */}
              {isLoggedIn && <NavigationBar />}
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
