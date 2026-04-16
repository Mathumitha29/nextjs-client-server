"use client";

import Link from "next/link";

interface AccessDeniedProps {
  message?: string;
  requiredRole?: "admin" | "viewer";
}

export function AccessDenied({
  message = "You don't have permission to access this page.",
  requiredRole,
}: AccessDeniedProps) {
  const roleMessage =
    requiredRole === "admin"
      ? "This page requires Admin privileges."
      : requiredRole === "viewer"
      ? "This page requires Viewer privileges."
      : "";

  return (
    <div className="access-denied">
      <div className="access-denied-icon">🚫</div>
      <h2 className="access-denied-title">Access Denied</h2>
      <p className="access-denied-message">
        {message}
        {roleMessage && <br />}
        {roleMessage}
      </p>
      <Link href="/dashboard" className="sso-button" style={{ maxWidth: 200 }}>
        Go to Dashboard
      </Link>
    </div>
  );
}
