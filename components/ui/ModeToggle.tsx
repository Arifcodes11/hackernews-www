"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";


export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false); // Ensure the theme is mounted to avoid hydration mismatch

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center ml-5" onClick={toggleTheme}>

      {resolvedTheme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
<span className="sr-only">Toggle theme</span> 
    </div>
  );
}
