"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { Flex, Spin, Typography } from "antd";

const { Text } = Typography;

export default function SignoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/login" });
  }, []);

  return (
    <Flex
      align="center"
      justify="center"
      vertical
      gap={16}
      style={{ minHeight: "100vh", background: "linear-gradient(135deg, #EEEFFD 0%, #f5f6ff 100%)" }}
    >
      <Spin size="large" />
      <Text type="secondary">Signing out…</Text>
    </Flex>
  );
}
