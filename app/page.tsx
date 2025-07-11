// ✅ Server Component (no "use client")
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default async function RootPage() {
  // ✅ Check for auth cookie from BetterAuth
  const cookieStore = await cookies();
  const session = cookieStore.get("better-auth.session-token");

  // ✅ If cookie exists, redirect to /feeds
  if (session?.value) {
    redirect("/feeds");
  }

  // ✅ Otherwise, render the landing page
  return (
    <div className="min-h-svh container mx-auto px-4">
      <div className="min-h-svh flex flex-col items-center justify-center gap-6 text-center">
        <div className="flex flex-col items-center gap-2 px-4 sm:px-6 md:px-8">
          <Image
            src="/robo-wave-removebg-preview.png"
            alt="Robot waving"
            width={384}
            height={192}
            className="object-contain"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-balance max-w-[90%] sm:max-w-[80%] md:max-w-prose">
            InSight360
          </h1>
          <p className="text-base sm:text-lg max-w-[90%] sm:max-w-[80%] md:max-w-prose text-muted-foreground">
            Your Gateway to the World&apos;s News, Trends, and Insights
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
          <Button variant="secondary" asChild className="w-full sm:w-auto">
            <Link href="/log-in">Log In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
