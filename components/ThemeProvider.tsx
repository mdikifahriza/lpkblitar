"use client";

import * as React from "react";

type Theme = "dark" | "light" | "system";

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light";
}

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(undefined);

const MEDIA_QUERY = "(prefers-color-scheme: dark)";

const getStoredTheme = (storageKey: string, defaultTheme: Theme) => {
  if (typeof window === "undefined") {
    return defaultTheme;
  }

  const savedTheme = window.localStorage.getItem(storageKey);

  return savedTheme === "dark" || savedTheme === "light" || savedTheme === "system"
    ? savedTheme
    : defaultTheme;
};

const subscribeToSystemTheme = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const mediaQuery = window.matchMedia(MEDIA_QUERY);
  mediaQuery.addEventListener("change", callback);

  return () => mediaQuery.removeEventListener("change", callback);
};

const getSystemTheme = (): "dark" | "light" => {
  if (typeof window === "undefined") {
    return "light" as const;
  }

  return window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light";
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}) {
  const [theme, setThemeState] = React.useState<Theme>(() =>
    getStoredTheme(storageKey, defaultTheme)
  );

  const systemTheme = React.useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemTheme,
    (): "dark" | "light" => "light"
  );

  const resolvedTheme = theme === "system" ? systemTheme : theme;

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
  }, [resolvedTheme]);

  React.useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === storageKey) {
        setThemeState(getStoredTheme(storageKey, defaultTheme));
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [defaultTheme, storageKey]);

  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      window.localStorage.setItem(storageKey, newTheme);
      setThemeState(newTheme);
    },
    [storageKey]
  );

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
