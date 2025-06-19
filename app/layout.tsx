

import { Inter } from "next/font/google";
import "./globals.css";
import { PropsWithChildren } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import NavigationBar from "@/components/NavigationBar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Insight Hub",
  description: "Built by Kethan",
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
          <div className="min-h-screen flex flex-col bg-background text-foreground">
            <NavigationBar />
            <main className="flex-1 p-4 pt-[4.5rem]">{children}</main>
            <footer className="text-center text-sm text-muted-foreground py-4 border-t">
              © {new Date().getFullYear()} InsightHub — Built by Kethan. All rights reserved.
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
