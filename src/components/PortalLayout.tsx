"use client";

import { Layout } from "antd";

const { Content } = Layout;

export function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {children}
    </Layout>
  );
}

export function PortalContent({ children }: { children: React.ReactNode }) {
  return (
    <Content
      style={{
        background: "linear-gradient(135deg, #EEEFFD 0%, #f5f6ff 50%, #eef0ff 100%)",
        padding: "32px 24px",
        minHeight: "calc(100vh - 56px)",
      }}
    >
      {children}
    </Content>
  );
}
