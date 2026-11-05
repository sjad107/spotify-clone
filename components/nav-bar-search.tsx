"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as Separator from "@radix-ui/react-separator";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import * as Icons from "./icons";

const SEARCH_PREFIX = "/search/";

function queryFromPath(pathname: string): string {
  if (!pathname.startsWith(SEARCH_PREFIX)) return "";
  const encoded = pathname.slice(SEARCH_PREFIX.length);
  try {
    return decodeURIComponent(encoded);
  } catch {
    return encoded;
  }
}

/** The search input. The query lives in the URL, as /search/<query>. */
const NavBarSearch = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const urlQuery = queryFromPath(pathname);
  const [value, setValue] = useState(urlQuery);

  // Pick up URL changes from links and back/forward. While the input is
  // focused the user is typing, and a slightly older URL mustn't overwrite it.
  useEffect(() => {
    if (document.activeElement !== inputRef.current) setValue(urlQuery);
  }, [urlQuery]);

  const isOnSearch = pathname === "/search" || pathname.startsWith(SEARCH_PREFIX);

  const onChange = (next: string) => {
    setValue(next);
    const trimmed = next.trim();
    if (!trimmed) {
      if (isOnSearch) router.replace("/search");
      return;
    }
    // Browsers collapse "." and ".." path segments, which would leave /search.
    if (/^\.+$/.test(trimmed)) return;
    const target = `${SEARCH_PREFIX}${encodeURIComponent(trimmed)}`;
    if (isOnSearch) {
      router.replace(target);
    } else {
      router.push(target);
    }
  };

  return (
    <form
      role="search"
      onSubmit={(event) => event.preventDefault()}
      className={cn("group relative h-12 w-full", className)}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 flex w-12 items-center justify-center">
        <Icons.SearchIcon className="text-spotify-subdued group-focus-within:text-white group-hover:text-white" />
      </div>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="What do you want to play?"
        placeholder="What do you want to play?"
        className="h-full w-full truncate rounded-full border border-transparent bg-spotify-highlight pl-12 pr-24 text-base font-normal text-white transition-colors placeholder:text-spotify-subdued hover:border-white/10 hover:bg-spotify-elevated focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="text-spotify-subdued hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        )}
        <Separator.Root
          className={cn("mx-3 h-6 w-px bg-spotify-muted", value && "hidden")}
          decorative
          orientation="vertical"
        />
        <Link
          href="/search"
          aria-label="Browse"
          className={cn(value && "hidden")}
        >
          {pathname === "/search" ? (
            <Icons.BrowseIconActive />
          ) : (
            <Icons.BrowseIcon />
          )}
        </Link>
      </div>
    </form>
  );
};

export default NavBarSearch;
