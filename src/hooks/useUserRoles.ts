"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import type { GroupCheckResponse } from "@/types/auth";

interface UseUserRolesResult {
  roles: GroupCheckResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserRoles(): UseUserRolesResult {
  const { data: session, status } = useSession();
  const [roles, setRoles] = useState<GroupCheckResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    if (status !== "authenticated" || !session) {
      setIsLoading(false);
      return;
    }

    // Check for token refresh error
    if (session.error === "RefreshAccessTokenError") {
      setError("Session expired. Please sign in again.");
      setIsLoading(false);
      // Optionally sign out the user
      await signOut({ callbackUrl: "/login?error=SessionExpired" });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/verify-token");
      const data = await response.json();

      if (!response.ok) {
        if (data.code === "TOKEN_EXPIRED") {
          setError("Token expired. Please sign in again.");
          await signOut({ callbackUrl: "/login?error=SessionExpired" });
          return;
        }
        throw new Error(data.error || "Failed to fetch user roles");
      }

      setRoles(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Error fetching user roles:", err);
    } finally {
      setIsLoading(false);
    }
  }, [session, status]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return { roles, isLoading, error, refetch: fetchRoles };
}
