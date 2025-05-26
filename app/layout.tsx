import { PropsWithChildren } from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TanstackQueryClientProvider } from "@/components/providers/tanstack-query-client-provider";
import { Toaster } from "@/components/ui/sonner";
import NavigationBar from "@/components/ui/NavigationBar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Insight360",
  description:
    "Breaking barriers in news—tech, trends, and world affairs delivered with depth and clarity.",
};

const RootLayout = ({ children }: PropsWithChildren) => {
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
              <NavigationBar />
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
