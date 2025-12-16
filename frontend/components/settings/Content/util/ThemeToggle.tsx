"use client";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex gap-3">
        <div className="w-24 h-24 bg-muted animate-pulse rounded-lg"></div>
        <div className="w-24 h-24 bg-muted animate-pulse rounded-lg"></div>
        <div className="w-24 h-24 bg-muted animate-pulse rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <button
        onClick={() => setTheme("light")}
        className={`flex flex-col items-center justify-center gap-2 px-6 py-4 rounded-lg border-2 transition-all ${
          theme === "light"
            ? "border-chart-1 bg-blue-50 dark:bg-blue-900/20"
            : "border-border bg-background hover:bg-accent"
        }`}
      >
        <Sun
          className={`w-6 h-6 ${
            theme === "light" ? "text-chart-1" : "text-foreground"
          }`}
        />
        <span
          className={`text-sm font-medium ${
            theme === "light" ? "text-chart-1" : "text-foreground"
          }`}
        >
          Light
        </span>
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`flex flex-col items-center justify-center gap-2 px-6 py-4 rounded-lg border-2 transition-all ${
          theme === "dark"
            ? "border-chart-1 bg-blue-50 dark:bg-background"
            : "border-border bg-background hover:bg-accent"
        }`}
      >
        <Moon
          className={`w-6 h-6 ${
            theme === "dark" ? "text-chart-1" : "text-foreground"
          }`}
        />
        <span
          className={`text-sm font-medium ${
            theme === "dark" ? "text-chart-1" : "text-foreground"
          }`}
        >
          Dark
        </span>
      </button>

      <button
        onClick={() => setTheme("system")}
        className={`flex flex-col items-center justify-center gap-2 px-6 py-4 rounded-lg border-2 transition-all ${
          theme === "system"
            ? "border-chart-1 bg-blue-50 dark:bg-background"
            : "border-border bg-background hover:bg-accent"
        }`}
      >
        <Monitor
          className={`w-6 h-6 ${
            theme === "system" ? "text-chart-1" : "text-foreground"
          }`}
        />
        <span
          className={`text-sm font-medium ${
            theme === "system" ? "text-chart-1" : "text-foreground"
          }`}
        >
          System
        </span>
      </button>
    </div>
  );
}
