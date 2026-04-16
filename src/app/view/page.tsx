"use client";

import { useSession } from "next-auth/react";
import { Header } from "@/components/Header";
import { Loading } from "@/components/Loading";
import { AccessDenied } from "@/components/AccessDenied";
import { useUserRoles } from "@/hooks/useUserRoles";

// Sample data for demonstration
const sampleData = [
  {
    id: 1,
    name: "Project Alpha",
    status: "Active",
    lastUpdated: "2026-04-15",
    owner: "John Doe",
  },
  {
    id: 2,
    name: "Project Beta",
    status: "In Progress",
    lastUpdated: "2026-04-14",
    owner: "Jane Smith",
  },
  {
    id: 3,
    name: "Project Gamma",
    status: "Completed",
    lastUpdated: "2026-04-10",
    owner: "Bob Johnson",
  },
  {
    id: 4,
    name: "Project Delta",
    status: "On Hold",
    lastUpdated: "2026-04-08",
    owner: "Alice Brown",
  },
  {
    id: 5,
    name: "Project Epsilon",
    status: "Active",
    lastUpdated: "2026-04-17",
    owner: "Charlie Wilson",
  },
];

const statusColors: Record<string, string> = {
  Active: "#2e7d32",
  "In Progress": "#1976d2",
  Completed: "#388e3c",
  "On Hold": "#ed6c02",
};

export default function ViewPage() {
  const { status } = useSession();
  const { roles, isLoading: rolesLoading } = useUserRoles();

  if (status === "loading" || rolesLoading) {
    return <Loading message="Checking view access..." />;
  }

  if (!roles?.isViewer) {
    return (
      <>
        <Header showNav={false} />
        <AccessDenied requiredRole="viewer" />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="page-container">
        <div className="card">
          <h2 className="card-title">📊 View Data</h2>
          <div className="card-content">
            <p>
              Welcome to the data view page. You have read-only access to view
              application data.
              {roles.isAdmin && (
                <span style={{ color: "var(--primary-color)" }}>
                  {" "}
                  As an admin, you can also manage data from the Admin panel.
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Projects Overview</h2>
          <div className="card-content">
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "1rem",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "2px solid #eee",
                      textAlign: "left",
                    }}
                  >
                    <th style={{ padding: "12px 8px" }}>ID</th>
                    <th style={{ padding: "12px 8px" }}>Project Name</th>
                    <th style={{ padding: "12px 8px" }}>Status</th>
                    <th style={{ padding: "12px 8px" }}>Owner</th>
                    <th style={{ padding: "12px 8px" }}>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleData.map((item) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <td style={{ padding: "12px 8px" }}>{item.id}</td>
                      <td style={{ padding: "12px 8px", fontWeight: 500 }}>
                        {item.name}
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "0.875rem",
                            backgroundColor: `${statusColors[item.status]}20`,
                            color: statusColors[item.status],
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 8px" }}>{item.owner}</td>
                      <td style={{ padding: "12px 8px", color: "#666" }}>
                        {item.lastUpdated}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <h2 className="card-title">Statistics</h2>
            <div className="card-content">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    padding: "1rem",
                    background: "#f5f5f5",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ fontSize: "2rem", fontWeight: 600 }}>5</div>
                  <div style={{ color: "#666" }}>Total Projects</div>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    padding: "1rem",
                    background: "#e8f5e9",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: 600,
                      color: "#2e7d32",
                    }}
                  >
                    2
                  </div>
                  <div style={{ color: "#666" }}>Active</div>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    padding: "1rem",
                    background: "#e3f2fd",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: 600,
                      color: "#1976d2",
                    }}
                  >
                    1
                  </div>
                  <div style={{ color: "#666" }}>In Progress</div>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    padding: "1rem",
                    background: "#fff3e0",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: 600,
                      color: "#ed6c02",
                    }}
                  >
                    1
                  </div>
                  <div style={{ color: "#666" }}>On Hold</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Recent Activity</h2>
            <div className="card-content">
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div
                  style={{
                    padding: "0.75rem",
                    background: "#f5f5f5",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                  }}
                >
                  <strong>Project Epsilon</strong> was updated
                  <div style={{ color: "#666", marginTop: "4px" }}>Today, 2:30 PM</div>
                </div>
                <div
                  style={{
                    padding: "0.75rem",
                    background: "#f5f5f5",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                  }}
                >
                  <strong>Project Alpha</strong> status changed to Active
                  <div style={{ color: "#666", marginTop: "4px" }}>Yesterday, 10:15 AM</div>
                </div>
                <div
                  style={{
                    padding: "0.75rem",
                    background: "#f5f5f5",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                  }}
                >
                  <strong>Project Gamma</strong> marked as Completed
                  <div style={{ color: "#666", marginTop: "4px" }}>Apr 10, 4:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Your Access Information</h2>
          <div className="card-content">
            <p>
              <strong>User:</strong> {roles.userInfo?.name} ({roles.userInfo?.email})
            </p>
            <p>
              <strong>Access Level:</strong>{" "}
              {roles.isAdmin ? (
                <span className="role-badge role-admin">Admin</span>
              ) : (
                <span className="role-badge role-viewer">Viewer</span>
              )}
            </p>
            <p style={{ marginTop: "0.5rem", color: "#666", fontSize: "0.875rem" }}>
              {roles.isAdmin
                ? "You have full read/write access to all data."
                : "You have read-only access to view data."}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
