import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { Figtree } from "next/font/google";
import { AuthProvider } from "@/components/auth-provider";
import { parseSession, SESSION_COOKIE } from "@/lib/session";

const font = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spotify Clone",
  description: "Sajjad-Spotify Clone",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const user = parseSession(cookieStore.get(SESSION_COOKIE)?.value);

  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <AuthProvider initialUser={user}>{children}</AuthProvider>
      </body>
    </html>
  );
}
