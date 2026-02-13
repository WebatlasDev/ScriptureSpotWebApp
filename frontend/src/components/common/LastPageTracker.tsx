"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const EXCLUDED_PATHS = [
  "/login",
  "/signup",
  "/register",
  "/forgot-password",
  "/support",
];

export default function LastPageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (
      pathname &&
      pathname !== '/' &&
      !EXCLUDED_PATHS.some((p) => pathname.startsWith(p))
    ) {
      const now = new Date().toISOString();
      const last = { path: pathname, timestamp: now };
      localStorage.setItem('lastPage', JSON.stringify(last));
      document.cookie = `lastPage=${pathname}; path=/; max-age=${60 * 60 * 24 * 7}`;
      document.cookie = `lastVisited=${now}; path=/; max-age=${60 * 60 * 24 * 7}`;
    }
  }, [pathname]);

  return null;
}
