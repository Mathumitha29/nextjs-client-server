"use client";

import { useSession } from "next-auth/react";
import { Loading } from "@/components/Loading";
import { AccessDenied } from "@/components/AccessDenied";
import { useUserRoles } from "@/hooks/useUserRoles";
import {
  Card,
  Col,
  Flex,
  List,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  AppstoreOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PauseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface Project {
  id: number;
  name: string;
  status: string;
  lastUpdated: string;
  owner: string;
}

const sampleData: Project[] = [
  { id: 1, name: "Project Alpha", status: "Active", lastUpdated: "2026-04-15", owner: "John Doe" },
  { id: 2, name: "Project Beta", status: "In Progress", lastUpdated: "2026-04-14", owner: "Jane Smith" },
  { id: 3, name: "Project Gamma", status: "Completed", lastUpdated: "2026-04-10", owner: "Bob Johnson" },
  { id: 4, name: "Project Delta", status: "On Hold", lastUpdated: "2026-04-08", owner: "Alice Brown" },
  { id: 5, name: "Project Epsilon", status: "Active", lastUpdated: "2026-04-17", owner: "Charlie Wilson" },
];

const STATUS_COLOR: Record<string, string> = {
  Active: "success",
  "In Progress": "processing",
  Completed: "default",
  "On Hold": "warning",
};

const recentActivity = [
  { title: "Project Epsilon was updated", time: "Today, 2:30 PM" },
  { title: "Project Alpha status changed to Active", time: "Yesterday, 10:15 AM" },
  { title: "Project Gamma marked as Completed", time: "Apr 10, 4:00 PM" },
];

export default function ViewPage() {
  const { status } = useSession();
  const { roles, isLoading: rolesLoading } = useUserRoles();

  if (status === "loading" || rolesLoading) {
    return <Loading message="Checking view access..." />;
  }

  if (!roles?.isViewer) {
    return <AccessDenied requiredRole="viewer" />;
  }

  const columns: ColumnsType<Project> = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Project Name", dataIndex: "name", key: "name", render: (v) => <Text strong>{v}</Text> },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: (v) => <Tag color={STATUS_COLOR[v] ?? "default"}>{v}</Tag>,
    },
    { title: "Owner", dataIndex: "owner", key: "owner" },
    { title: "Last Updated", dataIndex: "lastUpdated", key: "lastUpdated", render: (v) => <Text type="secondary">{v}</Text> },
  ];

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        <Space><AppstoreOutlined style={{ color: "#5865DC" }} />Projects Overview</Space>
      </Title>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { label: "Total", value: 5, icon: <AppstoreOutlined />, color: "#5865DC" },
          { label: "Active", value: 2, icon: <CheckCircleOutlined />, color: "#52c41a" },
          { label: "In Progress", value: 1, icon: <SyncOutlined spin />, color: "#1677ff" },
          { label: "On Hold", value: 1, icon: <PauseCircleOutlined />, color: "#fa8c16" },
        ].map(({ label, value, icon, color }) => (
          <Col xs={12} sm={6} key={label}>
            <Card variant="outlined" styles={{ body: { padding: "16px 20px" } }}>
              <Statistic
                title={label}
                value={value}
                prefix={<span style={{ color }}>{icon}</span>}
                styles={{ content: { color, fontWeight: 700, fontSize: 28 } }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Table */}
      <Card variant="outlined" style={{ marginBottom: 24 }}>
        <Table
          dataSource={sampleData}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </Card>

      {/* Bottom cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card variant="outlined" title={<Space><ClockCircleOutlined style={{ color: "#5865DC" }} />Recent Activity</Space>}>
            <List
              size="small"
              dataSource={recentActivity}
              renderItem={(item) => (
                <List.Item>
                  <div>
                    <Text>{item.title}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card variant="outlined" title="Your Access">
            <Flex vertical gap={8}>
              <Space>
                <Text type="secondary">User:</Text>
                <Text>{roles.userInfo?.name} ({roles.userInfo?.email})</Text>
              </Space>
              <Space>
                <Text type="secondary">Access Level:</Text>
                {roles.isAdmin ? <Tag color="geekblue">Admin</Tag> : <Tag color="blue">Viewer</Tag>}
              </Space>
              <Text type="secondary" style={{ fontSize: 12, marginTop: 8 }}>
                {roles.isAdmin
                  ? "You have full read/write access to all data."
                  : "You have read-only access to view data."}
              </Text>
            </Flex>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

