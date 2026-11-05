import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LikedSongsPage from "@/components/liked-songs-page";
import { loginHref, parseSession, SESSION_COOKIE } from "@/lib/session";

export default async function LikedSongs() {
  const cookieStore = await cookies();
  if (!parseSession(cookieStore.get(SESSION_COOKIE)?.value)) {
    redirect(loginHref("/collection/tracks"));
  }
  return <LikedSongsPage />;
}
