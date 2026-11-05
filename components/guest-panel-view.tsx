"use client";

import Link from "next/link";
import { HidePanelIcon } from "./icons";
import { usePanel } from "./panel-provider";

/** The contents of the right panel while logged out. */
export default function GuestPanelView() {
  const { setCollapsed } = usePanel();

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
      <button
        type="button"
        aria-label="Hide Now Playing view"
        onClick={() => setCollapsed(true)}
        className="absolute left-4 top-4 flex h-8 w-4 items-center text-spotify-subdued opacity-0 transition hover:scale-105 hover:text-white focus-visible:opacity-100 group-hover/panel:opacity-100"
      >
        <HidePanelIcon />
      </button>
      <h2 className="text-2xl font-bold text-white">Find something to play</h2>
      <Link
        href="/search"
        className="mt-4 flex h-8 items-center rounded-full bg-spotify-green px-4 text-sm font-bold text-black transition hover:scale-105 hover:bg-spotify-green-hover"
      >
        Search
      </Link>
    </div>
  );
}
