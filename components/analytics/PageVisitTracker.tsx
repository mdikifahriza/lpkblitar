"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isTrackablePublicPath, normalizeTrackedPath } from "@/lib/analytics";

const SESSION_STORAGE_KEY = "lpkblitar.analytics.session-id";
const LAST_TRACK_STORAGE_KEY = "lpkblitar.analytics.last-track";
const PREVIOUS_PATH_STORAGE_KEY = "lpkblitar.analytics.previous-path";

function getOrCreateSessionId() {
  const existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY);

  if (existing) {
    return existing;
  }

  const sessionId =
    typeof window.crypto?.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  window.sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  return sessionId;
}

function shouldSkipTrack(path: string) {
  const rawValue = window.sessionStorage.getItem(LAST_TRACK_STORAGE_KEY);

  if (!rawValue) {
    return false;
  }

  try {
    const previous = JSON.parse(rawValue) as { path?: string; trackedAt?: number };
    return previous.path === path && Date.now() - Number(previous.trackedAt || 0) < 1500;
  } catch {
    return false;
  }
}

function getReferrerValue(currentPath: string) {
  const previousPath = window.sessionStorage.getItem(PREVIOUS_PATH_STORAGE_KEY);

  if (previousPath && previousPath !== currentPath) {
    return previousPath;
  }

  const rawReferrer = document.referrer.trim();

  if (!rawReferrer) {
    return "";
  }

  try {
    const referrerUrl = new URL(rawReferrer);

    if (referrerUrl.origin === window.location.origin) {
      return referrerUrl.pathname !== currentPath ? referrerUrl.pathname : "";
    }

    return rawReferrer;
  } catch {
    return "";
  }
}

function rememberTrackedPath(path: string) {
  window.sessionStorage.setItem(
    LAST_TRACK_STORAGE_KEY,
    JSON.stringify({
      path,
      trackedAt: Date.now(),
    })
  );
  window.sessionStorage.setItem(PREVIOUS_PATH_STORAGE_KEY, path);
}

export function PageVisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const normalizedPath = normalizeTrackedPath(pathname || "/");

    if (!isTrackablePublicPath(normalizedPath) || shouldSkipTrack(normalizedPath)) {
      return;
    }

    const sessionId = getOrCreateSessionId();
    const referrer = getReferrerValue(normalizedPath);
    rememberTrackedPath(normalizedPath);

    void fetch("/api/analytics/page-visit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: normalizedPath,
        session_id: sessionId,
        referrer,
        metadata: {
          title: document.title || "",
        },
      }),
      keepalive: true,
      credentials: "same-origin",
    }).catch(() => {
      // Tracking must stay silent for visitors.
    });
  }, [pathname]);

  return null;
}
