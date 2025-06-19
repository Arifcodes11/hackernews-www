

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";
import { betterAuthClient } from "@/lib/integrations/better-auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  LogOutIcon,
  UserIcon,
  Moon,
  Sun,
  Home,
  Search,
} from "lucide-react";

const NavigationBar = () => {
  const { data } = betterAuthClient.useSession();
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await betterAuthClient.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Error while logging out.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setShowMobileSearch(false);
      setSearchTerm("");
    }
  };

  const user = data?.user;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-background/70 border-b shadow-sm px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
        {/* Left: Logo and Home */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <Home className="w-5 h-5" />
            </Button>
            <Link href="/" className="text-lg font-semibold hover:text-primary hidden sm:block">
              Insight Hub
            </Link>
          </div>

          {/* Search icon, theme toggle, user dropdown, login for small devices */}
          <div className="sm:hidden flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="icon" onClick={() => setShowMobileSearch((prev) => !prev)}>
              <Search className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            {!user ? (
              <Link href="/login">
                <Button size="sm">Login</Button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0">
                    <Avatar className="h-6 w-6">
                      {user.image ? <AvatarImage src={user.image} /> : <AvatarFallback>{user.name[0]}</AvatarFallback>}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        {user.image ? (
                          <AvatarImage src={user.image} />
                        ) : (
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        )}
                      </Avatar>
                      <div className="text-sm max-w-[200px] truncate">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-muted-foreground text-xs break-words">{user.email}</p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    {isLoading ? "Logging out..." : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Search bar */}
        <div className="w-full sm:w-auto">
          {/* Mobile search bar */}
          {showMobileSearch && (
            <form onSubmit={handleSearch} className="flex sm:hidden gap-2 items-center mt-2">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                className="px-3 py-1 rounded-md border text-sm w-full bg-background border-muted"
              />
              <Button type="submit" size="sm">
                Search
              </Button>
            </form>
          )}

          {/* Desktop search bar */}
          <form onSubmit={handleSearch} className="hidden sm:flex gap-2 items-center">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1 rounded-md border text-sm w-64 lg:w-96 bg-background border-muted"
            />
            <Button type="submit" variant="default" size="sm">
              Search
            </Button>
          </form>
        </div>

        {/* Desktop: Theme and user dropdown */}
        <div className="hidden sm:flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          {!user ? (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-6 w-6">
                    {user.image ? <AvatarImage src={user.image} /> : <AvatarFallback>{user.name[0]}</AvatarFallback>}
                  </Avatar>
                  <span className="text-sm hidden sm:inline">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      {user.image ? (
                        <AvatarImage src={user.image} />
                      ) : (
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="text-sm max-w-[200px] truncate">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-muted-foreground text-xs break-words">{user.email}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  {isLoading ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
