"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import * as Icons from "./icons";

/** Below the md breakpoint the top navbar is hidden, so these tabs replace it. */
export default function MobileNav() {
  const pathname = usePathname();
  const onSearch = pathname.startsWith("/search");

  return (
    <nav className="flex h-14 shrink-0 items-center justify-around bg-black md:hidden">
      <Link
        href="/"
        className={cn(
          "flex flex-col items-center gap-0.5 text-[11px]",
          pathname === "/" ? "text-white" : "text-spotify-subdued"
        )}
      >
        {pathname === "/" ? <Icons.HomeIconActive /> : <Icons.HomeIcon />}
        Home
      </Link>
      <Link
        href="/search"
        className={cn(
          "flex flex-col items-center gap-0.5 text-[11px]",
          onSearch ? "text-white" : "text-spotify-subdued"
        )}
      >
        <Icons.SearchIcon className={onSearch ? "text-white" : undefined} />
        Search
      </Link>
    </nav>
  );
}
