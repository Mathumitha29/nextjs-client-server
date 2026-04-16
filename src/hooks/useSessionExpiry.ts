"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";

interface UseSessionExpiryResult {
  isExpiringSoon: boolean;
  timeRemaining: number | null;
  handleRefresh: () => Promise<void>;
  handleSignOut: () => Promise<void>;
}

// Time in ms before expiry to show warning (5 minutes)
const EXPIRY_WARNING_THRESHOLD = 5 * 60 * 1000;

export function useSessionExpiry(): UseSessionExpiryResult {
  const { data: session, update } = useSession();
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Update session to trigger token refresh
  const handleRefresh = useCallback(async () => {
    try {
      await update();
      setIsExpiringSoon(false);
    } catch (error) {
      console.error("Error refreshing session:", error);
      // If refresh fails, sign out
      await signOut({ callbackUrl: "/login?error=SessionExpired" });
    }
  }, [update]);

  const handleSignOut = useCallback(async () => {
    await signOut({ callbackUrl: "/login" });
  }, []);

  useEffect(() => {
    if (!session?.expires) return;

    const checkExpiry = () => {
      const expiresAt = new Date(session.expires).getTime();
      const now = Date.now();
      const remaining = expiresAt - now;

      setTimeRemaining(remaining);

      if (remaining <= 0) {
        // Session has expired
        signOut({ callbackUrl: "/login?error=SessionExpired" });
      } else if (remaining <= EXPIRY_WARNING_THRESHOLD) {
        setIsExpiringSoon(true);
      } else {
        setIsExpiringSoon(false);
      }
    };

    // Check immediately
    checkExpiry();

    // Check every 30 seconds
    const interval = setInterval(checkExpiry, 30 * 1000);

    return () => clearInterval(interval);
  }, [session?.expires]);

  // Handle token refresh error
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/login?error=SessionExpired" });
    }
  }, [session?.error]);

  return {
    isExpiringSoon,
    timeRemaining,
    handleRefresh,
    handleSignOut,
  };
}
