"use client";

interface LoadingProps {
  message?: string;
}

export function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p style={{ marginTop: "1rem", color: "#666" }}>{message}</p>
    </div>
  );
}
