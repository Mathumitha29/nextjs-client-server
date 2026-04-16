"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSessionExpiry } from "@/hooks/useSessionExpiry";
import { useUserRoles } from "@/hooks/useUserRoles";

interface HeaderProps {
  showNav?: boolean;
}

export function Header({ showNav = true }: HeaderProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { isExpiringSoon, timeRemaining, handleRefresh } = useSessionExpiry();
  const { roles } = useUserRoles();

  const formatTimeRemaining = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      {isExpiringSoon && timeRemaining && (
        <div className="session-warning">
          ⚠️ Your session will expire in {formatTimeRemaining(timeRemaining)}.
          <button onClick={handleRefresh}>Extend Session</button>
        </div>
      )}
      <header className="header">
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <h1 className="header-title">SSO Portal</h1>
          {showNav && (
            <nav className="nav">
              <Link
                href="/dashboard"
                className={`nav-link ${pathname === "/dashboard" ? "active" : ""}`}
              >
                Dashboard
              </Link>
              {(roles?.isAdmin || roles?.isViewer) && (
                <Link
                  href="/view"
                  className={`nav-link ${pathname === "/view" ? "active" : ""}`}
                >
                  View
                </Link>
              )}
              {roles?.isAdmin && (
                <Link
                  href="/admin"
                  className={`nav-link ${pathname === "/admin" ? "active" : ""}`}
                >
                  Admin
                </Link>
              )}
            </nav>
          )}
        </div>
        <div className="header-user">
          <div className="user-info">
            <div className="user-name">{session?.user?.name || "User"}</div>
            <div className="user-email">{session?.user?.email}</div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {roles?.isAdmin && <span className="role-badge role-admin">Admin</span>}
            {roles?.isViewer && !roles?.isAdmin && (
              <span className="role-badge role-viewer">Viewer</span>
            )}
          </div>
          <button onClick={handleSignOut} className="logout-button">
            Sign Out
          </button>
        </div>
      </header>
    </>
  );
}
