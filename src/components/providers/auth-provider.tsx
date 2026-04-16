"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider
      // Re-fetch session every 5 minutes to handle token refresh
      refetchInterval={5 * 60}
      // Re-fetch session when window is focused
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
}
