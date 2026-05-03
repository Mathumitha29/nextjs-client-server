"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Alert, Button, Card, Divider, Flex, Spin, Typography } from "antd";
import { ThunderboltFilled } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const ERROR_MESSAGES: Record<string, string> = {
  SessionExpired: "Your session has expired. Please sign in again.",
  OAuthSignin: "Error starting the authentication process.",
  OAuthCallback: "Error during authentication callback.",
  OAuthCreateAccount: "Error creating your account.",
  EmailCreateAccount: "Error creating your account.",
  Callback: "Authentication error. Please try again.",
  OAuthAccountNotLinked: "This account is already linked to another user.",
  SessionRequired: "Please sign in to access this page.",
  Default: "An authentication error occurred. Please try again.",
};

function LoginContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const errorMessage = error ? (ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default) : null;

  const handleSSOLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("microsoft-entra-id", { callbackUrl, redirect: true });
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <Flex style={{ minHeight: "100vh", background: "linear-gradient(135deg, #EEEFFD 0%, #f5f6ff 50%, #eef0ff 100%)" }}>
      {/* Left branding panel */}
      <div
        style={{
          width: "45%",
          background: "linear-gradient(160deg, #3d4fc4 0%, #5865DC 55%, #7b89e8 100%)",
          padding: "48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        className="login-brand-panel"
      >
        <Flex align="center" gap={10}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThunderboltFilled style={{ color: "#fff", fontSize: 16 }} />
          </div>
          <Text strong style={{ color: "#fff", fontSize: 17 }}>SSO Portal</Text>
        </Flex>
        <div>
          <Title level={3} style={{ color: "#fff", marginBottom: 8 }}>
            &ldquo;Secure access, seamlessly delivered.&rdquo;
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>
            Enterprise SSO powered by Microsoft Entra ID
          </Text>
        </div>
        <Flex gap={6}>
          <div style={{ width: 28, height: 5, borderRadius: 3, background: "#fff" }} />
          <div style={{ width: 10, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.4)" }} />
          <div style={{ width: 10, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.4)" }} />
        </Flex>
      </div>

      {/* Right login panel */}
      <Flex flex={1} align="center" justify="center" style={{ padding: "40px 24px" }}>
        <Card
          style={{ width: "100%", maxWidth: 380 }}
          styles={{ body: { padding: 32 } }}
          variant="outlined"
        >
          <Title level={3} style={{ marginBottom: 4 }}>Welcome back</Title>
          <Paragraph type="secondary" style={{ marginBottom: 24, fontSize: 13 }}>
            Sign in with your organisation account
          </Paragraph>

          {errorMessage && (
            <Alert
              type="error"
              message={errorMessage}
              showIcon
              style={{ marginBottom: 20 }}
            />
          )}

          <Button
            size="large"
            block
            loading={isLoading}
            onClick={handleSSOLogin}
            style={{ height: 46, fontWeight: 600 }}
            icon={
              !isLoading && (
                <svg width="18" height="18" viewBox="0 0 21 21" fill="none" style={{ flexShrink: 0 }}>
                  <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                </svg>
              )
            }
          >
            {isLoading ? "Redirecting to Microsoft..." : "Continue with Microsoft"}
          </Button>

          <Divider style={{ margin: "24px 0" }} />
          <Text type="secondary" style={{ fontSize: 11, display: "block", textAlign: "center" }}>
            By signing in you agree to your organisation&apos;s policies.
          </Text>
        </Card>
      </Flex>
    </Flex>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Flex align="center" justify="center" style={{ minHeight: "100vh" }}>
          <Spin size="large" />
        </Flex>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
