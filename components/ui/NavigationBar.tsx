"use client";

import { SearchBar } from "@/app/feeds/search/components/SearchBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { betterAuthClient } from "@/lib/integrations/better-auth";
import { House, LogOutIcon, SearchIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NavigationBar = () => {
  const router = useRouter();
  const { data } = betterAuthClient.useSession();
  const user = data?.user;
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // ✅ Hide navbar entirely if user is not logged in
  if (!user) return null;

  return (
    <nav className="mx-auto sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left - Logo */}
          <div className="flex items-center gap-4">
            <Link
              href="/feeds"
              className="text-2xl font-extrabold text-[#3B82F6] hover:text-blue-700"
            >
              I<span className="hidden sm:inline">nsight360</span>
            </Link>
          </div>

          {/* Center - SearchBar (desktop) */}
          <div className="hidden flex-1 max-w-2xl lg:flex lg:items-center lg:justify-center">
            <SearchBar />
          </div>

          {/* Right - User controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Search Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <SearchIcon className="h-5 w-5" />
            </Button>

            {/* Theme Toggle */}
            <div className="lg:flex">
              <ModeToggle />
            </div>

            <Link href={"/feeds"} className="hover:text-blue-600">
              <House />
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.image || "https://github.com/shadcn.png"}
                      alt={user.name || "User"}
                    />
                    <AvatarFallback>
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user.image || "https://github.com/shadcn.png"}
                        alt={user.name || "User"}
                      />
                      <AvatarFallback>
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="truncate font-medium">{user.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      const response = await betterAuthClient.signOut();
                      if (response.data) router.replace("/log-in");
                    }}
                  >
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search */}
        {showMobileSearch && (
          <div className="pb-4 lg:hidden">
            <SearchBar />
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
