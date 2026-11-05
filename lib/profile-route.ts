import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ME_ID, profileById } from "./mock-data";
import { loginHref, parseSession, SESSION_COOKIE } from "./session";

/**
 * Checks a /user/[id] route on the server. Unknown ids 404, and your own
 * profile (/user/me) sends guests to log in and come back.
 */
export async function checkProfileRoute(
  id: string,
  path: string,
  options: { privateList?: boolean } = {}
) {
  if (id === ME_ID) {
    const cookieStore = await cookies();
    if (!parseSession(cookieStore.get(SESSION_COOKIE)?.value)) {
      redirect(loginHref(path));
    }
    return;
  }
  // Other people's profiles exist, but their private lists don't.
  if (!profileById(id) || options.privateList) notFound();
}
