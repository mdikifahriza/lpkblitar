"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  className,
  showLabel = false,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size={showLabel ? "default" : "icon"}
        className={cn(
          "rounded-full border-border/80 bg-background/90 text-foreground shadow-sm",
          showLabel && "px-3",
          className
        )}
      >
        <span className="sr-only">Tunggu sebentar...</span>
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size={showLabel ? "default" : "icon"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "rounded-full border-border/80 bg-background/90 text-foreground shadow-sm hover:bg-muted/80",
        showLabel && "px-3",
        className
      )}
      title="Ubah Tema"
    >
      {isDark ? (
        <Sun className="h-[1.1rem] w-[1.1rem] transition-all duration-300" />
      ) : (
        <Moon className="h-[1.1rem] w-[1.1rem] transition-all duration-300" />
      )}
      {showLabel ? (
        <span className="text-xs font-semibold uppercase tracking-[0.2em]">
          Tema
        </span>
      ) : null}
      <span className="sr-only">Ubah Tema</span>
    </Button>
  );
}
