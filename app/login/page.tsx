import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "@/components/login-form";
import { parseSession, safeNextPath, SESSION_COOKIE } from "@/lib/session";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; mode?: string }>;
}) {
  const { next, mode } = await searchParams;
  const nextPath = safeNextPath(next);

  const cookieStore = await cookies();
  if (parseSession(cookieStore.get(SESSION_COOKIE)?.value)) {
    redirect(nextPath);
  }

  return <LoginForm nextPath={nextPath} signup={mode === "signup"} />;
}
