"use client";

import { useSyncExternalStore } from "react";

const VISITED_KEY = "mary-visited-projects";
const VISITED_EVENT = "mary:visited-projects";

let cachedRaw = "[]";
let cachedSet: ReadonlySet<string> = new Set();

function getSnapshot(): ReadonlySet<string> {
  if (typeof window === "undefined") return cachedSet;
  try {
    const raw = sessionStorage.getItem(VISITED_KEY) ?? "[]";
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      const parsed = JSON.parse(raw);
      cachedSet = new Set(Array.isArray(parsed) ? parsed : []);
    }
    return cachedSet;
  } catch {
    return cachedSet;
  }
}

const SERVER_SNAPSHOT: ReadonlySet<string> = new Set();
function getServerSnapshot(): ReadonlySet<string> {
  return SERVER_SNAPSHOT;
}

function subscribe(onChange: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(VISITED_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(VISITED_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function markProjectVisited(href: string) {
  if (typeof window === "undefined" || !href) return;
  try {
    const current = new Set(getSnapshot());
    if (current.has(href)) return;
    current.add(href);
    const nextRaw = JSON.stringify(Array.from(current));
    cachedRaw = nextRaw;
    cachedSet = current;
    sessionStorage.setItem(VISITED_KEY, nextRaw);
    window.dispatchEvent(new Event(VISITED_EVENT));
  } catch {
    // Ignore storage errors
  }
}

export function useVisitedProjects(): ReadonlySet<string> {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
