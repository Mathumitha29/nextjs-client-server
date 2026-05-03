"use client";

import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useSessionExpiry } from "@/hooks/useSessionExpiry";
import { useUserRoles } from "@/hooks/useUserRoles";
import {
  Avatar,
  Button,
  Flex,
  Layout,
  Menu,
  Space,
  Tag,
  Typography,
  Alert,
} from "antd";
import {
  DashboardOutlined,
  EyeOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

interface HeaderProps {
  showNav?: boolean;
}

export function Header({ showNav = true }: HeaderProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
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

  const navItems = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    ...((roles?.isAdmin || roles?.isViewer)
      ? [{ key: "/view", icon: <EyeOutlined />, label: "View" }]
      : []),
    ...(roles?.isAdmin
      ? [{ key: "/admin-zone/dashboard", icon: <SafetyCertificateOutlined />, label: "Admin Zone" }]
      : []),
  ];

  const avatarLetter = session?.user?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <>
      {isExpiringSoon && timeRemaining && (
        <Alert
          type="warning"
          banner
          message={
            <Flex align="center" justify="center" gap={12}>
              <span>Your session will expire in {formatTimeRemaining(timeRemaining)}.</span>
              <Button size="small" onClick={handleRefresh}>Extend Session</Button>
            </Flex>
          }
          style={{ textAlign: "center" }}
        />
      )}
      <AntHeader
        style={{
          background: "linear-gradient(90deg, #3d4fc4 0%, #5865DC 55%, #7b89e8 100%)",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
          height: 56,
          boxShadow: "0 2px 12px rgba(88,101,220,0.3)",
        }}
      >
        <Space size={16}>
          <Space size={10}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <ThunderboltFilled style={{ color: "#fff", fontSize: 14 }} />
            </div>
            <Text strong style={{ fontSize: 15, color: "#fff" }}>SSO Portal</Text>
          </Space>

          {showNav && (
            <Menu
              mode="horizontal"
              theme="dark"
              selectedKeys={[pathname]}
              items={navItems}
              style={{
                background: "transparent",
                borderBottom: "none",
                lineHeight: "56px",
                minWidth: 280,
              }}
              onClick={({ key }) => {
                if (key.startsWith("/admin-zone")) {
                  window.location.href = key;
                } else {
                  router.push(key);
                }
              }}
            />
          )}
        </Space>

        <Space size={16}>
          {session?.user && (
            <Space size={8}>
              <Avatar
                size={32}
                style={{ background: "rgba(255,255,255,0.25)", fontSize: 13, fontWeight: 700, color: "#fff", border: "2px solid rgba(255,255,255,0.4)" }}
              >
                {avatarLetter}
              </Avatar>
              <div style={{ lineHeight: 1.4 }}>
                <div><Text strong style={{ fontSize: 13, color: "#fff" }}>{session.user.name}</Text></div>
                <div><Text style={{ fontSize: 11, color: "rgba(255,255,255,0.65)" }}>{session.user.email}</Text></div>
              </div>
            </Space>
          )}
          {roles?.isAdmin && <Tag color="geekblue">Admin</Tag>}
          {roles?.isViewer && !roles.isAdmin && <Tag color="blue">Viewer</Tag>}
          <Button
            icon={<LogoutOutlined />}
            size="small"
            onClick={handleSignOut}
            style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}
          >
            Sign Out
          </Button>
        </Space>
      </AntHeader>
    </>
  );
}
