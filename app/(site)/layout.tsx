import MainLayout from "@/components/main-layout";

/** Everything inside the app shell. The login page sits outside it. */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
