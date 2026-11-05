"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { loginHref } from "@/lib/session";

/** Stands in for the player bar while logged out. */
export default function PreviewBanner() {
  const pathname = usePathname();

  return (
    <div className="shrink-0 px-2 py-2">
      <div className="flex min-h-[66px] items-center justify-between gap-4 rounded-lg bg-gradient-to-r from-[#af2896] to-[#509bf5] px-3 py-2 text-white md:px-4">
        <div className="min-w-0">
          <div className="text-sm font-bold">Preview of Spotify</div>
          <div className="hidden truncate text-base md:block">
            Sign up to get unlimited songs and podcasts with occasional ads. No
            credit card needed.
          </div>
        </div>
        <Link
          href={loginHref(pathname, "signup")}
          className="flex h-12 shrink-0 items-center rounded-full bg-white px-8 text-base font-bold text-black transition hover:scale-105"
        >
          Sign up free
        </Link>
      </div>
    </div>
  );
}
