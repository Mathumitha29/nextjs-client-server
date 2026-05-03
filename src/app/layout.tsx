import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { AntdRegistry } from "@/lib/antd-registry";
import { ConfigProvider } from "antd";

export const metadata: Metadata = {
  title: "SSO Application - Microsoft Entra ID",
  description: "Next.js application with Microsoft Entra ID SSO authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#5865DC",
                colorLink: "#5865DC",
                borderRadius: 8,
              },
            }}
          >
            <AuthProvider>{children}</AuthProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
