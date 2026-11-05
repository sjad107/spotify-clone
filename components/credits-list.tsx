"use client";

import Link from "next/link";
import { searchHref } from "@/lib/format";
import type { Credit } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { usePanel } from "./panel-provider";

function FollowButton({ name }: { name: string }) {
  const { followedNames, toggleFollow } = usePanel();
  const following = followedNames.has(name);
  return (
    <button
      type="button"
      aria-pressed={following}
      onClick={() => toggleFollow(name)}
      className="relative z-10 h-8 shrink-0 rounded-full border border-spotify-muted px-4 text-sm font-bold text-white transition hover:scale-105 hover:border-white"
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}

/** Rows of name, roles and, for artists, a Follow button. */
export default function CreditsList({ credits }: { credits: Credit[] }) {
  return (
    <ul>
      {credits.map((credit) => (
        <li
          key={credit.name}
          className={cn(
            "relative -mx-2 flex items-center justify-between gap-3 rounded-md p-2",
            credit.isArtist && "hover:bg-white/10"
          )}
        >
          <div className="min-w-0">
            {credit.isArtist ? (
              <Link
                href={searchHref(credit.name)}
                className="block truncate text-base leading-snug text-white after:absolute after:inset-0 after:rounded-md"
              >
                {credit.name}
              </Link>
            ) : (
              <div className="truncate text-base leading-snug text-white">
                {credit.name}
              </div>
            )}
            <div className="mt-0.5 truncate text-sm leading-snug text-spotify-subdued">
              {credit.roles.join(" • ")}
            </div>
          </div>
          {credit.isArtist && <FollowButton name={credit.name} />}
        </li>
      ))}
    </ul>
  );
}
