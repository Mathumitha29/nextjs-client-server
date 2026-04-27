"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

/**
 * Signout redirect page.
 *
 * The Admin Zone (and any other sub-application on the same domain) can send
 * users here to clear the shared NextAuth session cookie and return them to
 * the login page.  A direct GET link is enough – no cross-app CSRF token
 * needed.
 */
export default function SignoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/login" });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "1rem",
        fontFamily: "system-ui, sans-serif",
        color: "#666",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #0078d4",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <p>Signing out…</p>
      <style>{`@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
