"use client";

import { cn } from "@/lib/utils";
import type { CardItem } from "@/lib/mock-data";
import CoverArt from "./cover-art";
import ExplicitBadge from "./explicit-badge";
import PlayButton from "./play-button";
import { usePlayer } from "./player-provider";

interface MediaCardProps {
  item: CardItem;
  className?: string;
}

export default function MediaCard({ item, className }: MediaCardProps) {
  const { sourceId, isPlaying, toggleSource } = usePlayer();
  const canPlay = item.playables.length > 0;
  const active = sourceId === item.id;
  const playing = active && isPlaying;
  const onToggle = () => toggleSource(item.id, item.playables, item.sourceName);

  return (
    <div
      className={cn(
        "group relative rounded-lg p-3 transition-colors duration-200 hover:bg-white/10",
        className
      )}
    >
      <div className="relative mb-2">
        <CoverArt
          seed={item.coverSeed}
          shape={item.shape}
          variant={item.variant}
          label={item.label}
          className="shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
        />
        {canPlay && (
          <PlayButton
            playing={playing}
            label={item.title}
            onClick={onToggle}
            className={cn(
              "absolute bottom-2 right-2 z-10 translate-y-2 opacity-0 transition-all duration-200 focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100",
              playing && "translate-y-0 opacity-100"
            )}
          />
        )}
      </div>
      {canPlay ? (
        // Stretched over the whole card. There are no detail pages yet, so
        // clicking a card plays it.
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "block w-full truncate text-left text-base after:absolute after:inset-0 after:rounded-lg",
            active ? "text-spotify-green" : "text-white"
          )}
        >
          {item.title}
        </button>
      ) : (
        <div className="truncate text-base text-white">{item.title}</div>
      )}
      <div className="mt-0.5 line-clamp-2 text-sm text-spotify-subdued">
        {item.explicit && <ExplicitBadge />}
        {item.subtitle}
      </div>
    </div>
  );
}
