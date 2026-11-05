"use client";

import { Fragment } from "react";
import Link from "next/link";
import { searchHref } from "@/lib/format";
import type { Playable } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import CoverArt from "./cover-art";
import ExplicitBadge from "./explicit-badge";
import { PauseGlyph, PlayGlyph } from "./play-button";
import TrackMenu from "./track-menu";

interface QueueRowProps {
  item: Playable;
  active?: boolean;
  playing?: boolean;
  onPlay: () => void;
}

/** A 64px row used by Next in queue and the Queue view. */
export default function QueueRow({
  item,
  active = false,
  playing = false,
  onPlay,
}: QueueRowProps) {
  const Glyph = playing ? PauseGlyph : PlayGlyph;

  return (
    <div
      onDoubleClick={onPlay}
      className="group/row flex h-16 items-center gap-3 rounded-md p-2 focus-within:bg-white/10 hover:bg-white/10"
    >
      <div className="relative h-12 w-12 shrink-0">
        <CoverArt seed={item.coverSeed} className="rounded" />
        <button
          type="button"
          aria-label={`${playing ? "Pause" : "Play"} ${item.title}`}
          onClick={onPlay}
          className="absolute inset-0 flex items-center justify-center rounded bg-black/50 text-white opacity-0 transition-opacity focus-visible:opacity-100 group-hover/row:opacity-100"
        >
          <Glyph className="h-4 w-4" />
        </button>
      </div>
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "truncate text-base leading-snug",
            active ? "text-spotify-green" : "text-white"
          )}
        >
          {item.title}
        </div>
        <div className="mt-0.5 truncate text-sm leading-snug text-spotify-subdued">
          {item.explicit && <ExplicitBadge />}
          {item.artists.map((name, index) => (
            <Fragment key={name}>
              {index > 0 && ", "}
              <Link
                href={searchHref(name)}
                className="hover:text-white hover:underline"
              >
                {name}
              </Link>
            </Fragment>
          ))}
        </div>
      </div>
      <TrackMenu
        item={item}
        label={`More options for ${item.title}`}
        buttonClassName="w-4 opacity-0 focus-visible:opacity-100 group-hover/row:opacity-100 aria-expanded:opacity-100"
      />
    </div>
  );
}
