"use client";

import { useSession } from "next-auth/react";
import { Loading } from "@/components/Loading";
import { useUserRoles } from "@/hooks/useUserRoles";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Flex,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
} from "antd";
import {
  ArrowRightOutlined,
  IdcardOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { roles, isLoading: rolesLoading, error: rolesError } = useUserRoles();

  if (status === "loading" || rolesLoading) {
    return <Loading message="Loading dashboard..." />;
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      {/* Welcome header */}
      <Flex align="center" gap={12} style={{ marginBottom: 32 }}>
        <Avatar
          size={52}
          style={{ background: "#5865DC", fontSize: 22, fontWeight: 700, flexShrink: 0 }}
        >
          {session?.user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <div>
          <Flex align="center" gap={8} wrap>
            <Title level={3} style={{ margin: 0 }}>
              Welcome, {session?.user?.name?.split(" ")[0] ?? "User"}
            </Title>
            {roles?.isAdmin && <Tag color="geekblue">Admin</Tag>}
            {!roles?.isAdmin && roles?.isViewer && <Tag color="blue">Viewer</Tag>}
          </Flex>
          <Text type="secondary" style={{ fontSize: 13 }}>{session?.user?.email}</Text>
        </div>
      </Flex>

      {/* Stat cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card
            styles={{ body: { padding: "20px 24px" } }}
            style={{ background: "linear-gradient(135deg, #5865DC 0%, #7b89e8 100%)", border: "none", borderRadius: 12 }}
          >
            <Statistic
              title={<span style={{ color: "rgba(255,255,255,0.75)" }}>Role</span>}
              value={roles?.isAdmin ? "Administrator" : roles?.isViewer ? "Viewer" : "No Role"}
              styles={{ content: { color: "#fff", fontWeight: 700 } }}
              prefix={<IdcardOutlined style={{ color: "rgba(255,255,255,0.8)" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            styles={{ body: { padding: "20px 24px" } }}
            style={{ background: "linear-gradient(135deg, #3d4fc4 0%, #5865DC 100%)", border: "none", borderRadius: 12 }}
          >
            <Statistic
              title={<span style={{ color: "rgba(255,255,255,0.75)" }}>Groups</span>}
              value={roles?.groups.length ?? 0}
              styles={{ content: { color: "#fff", fontWeight: 700 } }}
              prefix={<TeamOutlined style={{ color: "rgba(255,255,255,0.8)" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            styles={{ body: { padding: "20px 24px" } }}
            style={{ background: "linear-gradient(135deg, #5c6ac4 0%, #8892ef 100%)", border: "none", borderRadius: 12 }}
          >
            <div style={{ marginBottom: 4 }}>
              <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>User ID</Text>
            </div>
            <Text
              code
              copyable
              ellipsis
              style={{ fontSize: 11, display: "block", maxWidth: "100%", background: "rgba(255,255,255,0.15)", color: "#fff", border: "none" }}
            >
              {session?.user?.id}
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Roles error */}
      {rolesError && (
        <Alert type="error" message={rolesError} showIcon style={{ marginBottom: 16 }} />
      )}

      {/* Admin alert */}
      {roles?.isAdmin && (
        <Alert
          type="info"
          icon={<SafetyCertificateOutlined />}
          showIcon
          message="Admin Access Enabled"
          description="You have full administrator privileges. Admin-only features are available."
          style={{ marginBottom: 16, borderRadius: 10 }}
        />
      )}

      {/* Quick links */}
      <Card variant="outlined" title={<Space><ArrowRightOutlined style={{ color: "#5865DC" }} /><span>Quick Links</span></Space>} style={{ marginBottom: 16 }}>
        <Space wrap>
          {(roles?.isAdmin || roles?.isViewer) && (
            <Button type="primary" href="/view" icon={<ArrowRightOutlined />}>
              View Data
            </Button>
          )}
          {roles?.isAdmin && (
            <Button
              href={process.env.NEXT_PUBLIC_ADMIN_ZONE_URL ?? "/admin-zone/dashboard"}
              icon={<SafetyCertificateOutlined />}
            >
              Admin Zone
            </Button>
          )}
        </Space>
      </Card>

      {/* Group memberships */}
      {roles?.groups && roles.groups.length > 0 && (
        <Card variant="outlined" title="Group Memberships">
          <Flex wrap gap={8}>
            {roles.groups.map((g) => (
              <Tag key={g} style={{ fontFamily: "monospace", margin: 0 }}>{g}</Tag>
            ))}
          </Flex>
        </Card>
      )}

      {/* Debug — dev only */}
      {process.env.NODE_ENV === "development" && (
        <Card
          variant="outlined"
          title="Debug Information"
          style={{ marginTop: 16 }}
          styles={{ body: { padding: "16px 24px" } }}
        >
          <Paragraph style={{ fontFamily: "monospace", fontSize: 12 }}>
            <strong>Access Token:</strong> {session?.accessToken ? `${session.accessToken.substring(0, 50)}...` : "Not available"}
          </Paragraph>
          <Paragraph style={{ fontFamily: "monospace", fontSize: 12 }}>
            <strong>ID Token:</strong> {session?.idToken ? `${session.idToken.substring(0, 50)}...` : "Not available"}
          </Paragraph>
        </Card>
      )}
    </div>
  );
}
