"use client";

import { useSession } from "next-auth/react";
import { Header } from "@/components/Header";
import { Loading } from "@/components/Loading";
import { useUserRoles } from "@/hooks/useUserRoles";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { roles, isLoading: rolesLoading, error: rolesError } = useUserRoles();

  if (status === "loading" || rolesLoading) {
    return <Loading message="Loading dashboard..." />;
  }

  return (
    <>
      <Header />
      <main className="page-container">
        <div className="card">
          <h2 className="card-title">Welcome, {session?.user?.name || "User"}!</h2>
          <div className="card-content">
            <p>You have successfully signed in with Microsoft SSO.</p>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <h2 className="card-title">User Information</h2>
            <div className="card-content">
              <p>
                <strong>Name:</strong> {session?.user?.name || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {session?.user?.email || "N/A"}
              </p>
              <p>
                <strong>User ID:</strong> {session?.user?.id || "N/A"}
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Access Roles</h2>
            <div className="card-content">
              {rolesError ? (
                <p style={{ color: "var(--error-color)" }}>{rolesError}</p>
              ) : roles ? (
                <>
                  <p>
                    <strong>Admin Access:</strong>{" "}
                    {roles.isAdmin ? "✅ Yes" : "❌ No"}
                  </p>
                  <p>
                    <strong>Viewer Access:</strong>{" "}
                    {roles.isViewer ? "✅ Yes" : "❌ No"}
                  </p>
                  <p style={{ marginTop: "0.5rem" }}>
                    <strong>Group Memberships:</strong>{" "}
                    {roles.groups.length > 0
                      ? roles.groups.length
                      : "No groups found"}
                  </p>
                </>
              ) : (
                <p>Loading roles...</p>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Quick Links</h2>
          <div className="card-content">
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {(roles?.isAdmin || roles?.isViewer) && (
                <a href="/view" className="sso-button" style={{ maxWidth: 200 }}>
                  View Data
                </a>
              )}
              {roles?.isAdmin && (
                <a href="/admin" className="sso-button" style={{ maxWidth: 200 }}>
                  Admin Panel
                </a>
              )}
            </div>
          </div>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="card">
            <h2 className="card-title">Debug Information</h2>
            <div className="card-content">
              <p>
                <strong>Access Token:</strong>
              </p>
              <div className="token-display">
                {session?.accessToken
                  ? `${session.accessToken.substring(0, 50)}...`
                  : "Not available"}
              </div>
              <p style={{ marginTop: "1rem" }}>
                <strong>ID Token:</strong>
              </p>
              <div className="token-display">
                {session?.idToken
                  ? `${session.idToken.substring(0, 50)}...`
                  : "Not available"}
              </div>
              <p style={{ marginTop: "1rem" }}>
                <strong>Groups from Token:</strong>
              </p>
              <div className="token-display">
                {roles?.groups?.length
                  ? roles.groups.join(", ")
                  : "No groups in token"}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
