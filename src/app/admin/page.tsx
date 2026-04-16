"use client";

import { useSession } from "next-auth/react";
import { Header } from "@/components/Header";
import { Loading } from "@/components/Loading";
import { AccessDenied } from "@/components/AccessDenied";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useState } from "react";

export default function AdminPage() {
  const { status } = useSession();
  const { roles, isLoading: rolesLoading } = useUserRoles();
  const [actionLog, setActionLog] = useState<string[]>([]);

  if (status === "loading" || rolesLoading) {
    return <Loading message="Checking admin access..." />;
  }

  if (!roles?.isAdmin) {
    return (
      <>
        <Header showNav={false} />
        <AccessDenied requiredRole="admin" />
      </>
    );
  }

  const handleAdminAction = (action: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setActionLog((prev) => [`[${timestamp}] ${action}`, ...prev].slice(0, 10));
  };

  return (
    <>
      <Header />
      <main className="page-container">
        <div className="card">
          <h2 className="card-title">🛡️ Admin Panel</h2>
          <div className="card-content">
            <p>
              Welcome to the admin panel. You have full administrative access to
              manage the application.
            </p>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <h2 className="card-title">User Management</h2>
            <div className="card-content">
              <p style={{ marginBottom: "1rem" }}>
                Manage user accounts and permissions.
              </p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button
                  className="sso-button"
                  style={{ maxWidth: 150 }}
                  onClick={() => handleAdminAction("Listed all users")}
                >
                  List Users
                </button>
                <button
                  className="sso-button"
                  style={{ maxWidth: 150 }}
                  onClick={() => handleAdminAction("Opened add user form")}
                >
                  Add User
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Group Management</h2>
            <div className="card-content">
              <p style={{ marginBottom: "1rem" }}>
                Manage Azure AD groups and role assignments.
              </p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button
                  className="sso-button"
                  style={{ maxWidth: 150 }}
                  onClick={() => handleAdminAction("Listed all groups")}
                >
                  List Groups
                </button>
                <button
                  className="sso-button"
                  style={{ maxWidth: 150 }}
                  onClick={() => handleAdminAction("Synced groups")}
                >
                  Sync Groups
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <h2 className="card-title">System Settings</h2>
            <div className="card-content">
              <p style={{ marginBottom: "1rem" }}>
                Configure application settings and preferences.
              </p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button
                  className="sso-button"
                  style={{ maxWidth: 150 }}
                  onClick={() => handleAdminAction("Opened SSO settings")}
                >
                  SSO Config
                </button>
                <button
                  className="sso-button"
                  style={{ maxWidth: 150 }}
                  onClick={() => handleAdminAction("Opened session settings")}
                >
                  Session Config
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Audit & Logs</h2>
            <div className="card-content">
              <p style={{ marginBottom: "1rem" }}>
                View authentication logs and audit trail.
              </p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button
                  className="sso-button"
                  style={{ maxWidth: 150 }}
                  onClick={() => handleAdminAction("Viewed auth logs")}
                >
                  Auth Logs
                </button>
                <button
                  className="sso-button"
                  style={{ maxWidth: 150 }}
                  onClick={() => handleAdminAction("Generated report")}
                >
                  Reports
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Action Log</h2>
          <div className="card-content">
            {actionLog.length > 0 ? (
              <div className="token-display">
                {actionLog.map((log, index) => (
                  <div key={index}>{log}</div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#999" }}>No actions performed yet.</p>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Admin Access Information</h2>
          <div className="card-content">
            <p>
              <strong>User Info:</strong> {roles.userInfo?.name} (
              {roles.userInfo?.email})
            </p>
            <p>
              <strong>Object ID:</strong> {roles.userInfo?.oid || "N/A"}
            </p>
            <p>
              <strong>Total Groups:</strong> {roles.groups?.length || 0}
            </p>
            <p style={{ marginTop: "1rem" }}>
              <strong>Admin Group ID:</strong>{" "}
              <code>{process.env.NEXT_PUBLIC_ADMIN_GROUP_ID || "Configured in server"}</code>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
