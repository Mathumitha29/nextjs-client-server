import { Header } from "@/components/Header";
import { PortalLayout, PortalContent } from "@/components/PortalLayout";

export default function AppPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalLayout>
      <Header />
      <PortalContent>{children}</PortalContent>
    </PortalLayout>
  );
}
