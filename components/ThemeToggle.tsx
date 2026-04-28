"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-foreground border-border hover:bg-muted focus-visible:ring-primary rounded-full border">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Pilih Tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border text-foreground rounded-lg">
        <DropdownMenuItem onClick={() => setTheme("light")} className="focus:bg-muted focus:text-foreground cursor-pointer rounded-md">
          Terang
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="focus:bg-muted focus:text-foreground cursor-pointer rounded-md">
          Gelap
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="focus:bg-muted focus:text-foreground cursor-pointer rounded-md">
          Sistem
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
