"use client";

import { useRouter } from "next/navigation";
import { Button, Result } from "antd";

interface AccessDeniedProps {
  message?: string;
  requiredRole?: "admin" | "viewer";
}

export function AccessDenied({
  message,
  requiredRole,
}: AccessDeniedProps) {
  const router = useRouter();

  const subTitle =
    message ??
    (requiredRole === "admin"
      ? "This page requires Admin privileges."
      : requiredRole === "viewer"
      ? "This page requires Viewer privileges."
      : "You don't have permission to access this page.");

  return (
    <Result
      status="403"
      title="Access Denied"
      subTitle={subTitle}
      extra={
        <Button type="primary" onClick={() => router.push("/dashboard")}>
          Go to Dashboard
        </Button>
      }
      style={{ minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center" }}
    />
  );
}
