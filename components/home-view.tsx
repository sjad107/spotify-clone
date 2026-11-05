"use client";

import { useEffect, useRef, useState } from "react";
import { coverColor } from "@/lib/cover";
import {
  homeQuickAccess,
  homeShelves,
  type CardItem,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import CoverArt from "./cover-art";
import FilterChips from "./filter-chips";
import PlayButton from "./play-button";
import { usePlayer } from "./player-provider";
import Shelf from "./shelf";
import StretchedAction from "./stretched-action";
import SiteFooter from "./site-footer";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "music", label: "Music" },
  { id: "podcasts", label: "Podcasts" },
] as const;

type HomeFilter = (typeof FILTERS)[number]["id"];

export default function HomeView() {
  const [filter, setFilter] = useState<HomeFilter>("all");
  const [hoveredSeed, setHoveredSeed] = useState<string | null>(null);
  const [isStuck, setIsStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // The chips stick to the top of the scroll area. They only need a solid
  // background once the sentinel at the top of the page has scrolled away.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) =>
      setIsStuck(!entry.isIntersecting)
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const quickAccess =
    filter === "podcasts" ? homeQuickAccess.podcasts : homeQuickAccess.music;
  const shelves = homeShelves.filter(
    (shelf) => filter === "all" || shelf.kind === filter
  );
  const tint = coverColor(hoveredSeed ?? quickAccess[0].coverSeed);

  return (
    <div className="relative min-h-full">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[332px] transition-colors duration-500"
        style={{
          backgroundColor: tint,
          backgroundImage: "linear-gradient(rgba(0,0,0,0.45), #121212)",
        }}
      />
      <div ref={sentinelRef} aria-hidden="true" className="absolute top-0 h-px w-full" />

      <div
        className="sticky top-0 z-30 px-4 py-3 transition-colors duration-300 md:px-10"
        style={
          isStuck
            ? {
                backgroundColor: tint,
                backgroundImage:
                  "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6))",
              }
            : undefined
        }
      >
        <FilterChips options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      <div className="relative z-10 px-4 md:px-10">
        <div
          className="mb-8 mt-2 grid grid-cols-2 gap-2 [@container_(min-width:700px)]:grid-cols-4"
          onMouseLeave={() => setHoveredSeed(null)}
        >
          {quickAccess.map((item) => (
            <QuickAccessTile
              key={item.id}
              item={item}
              onHover={() => setHoveredSeed(item.coverSeed)}
            />
          ))}
        </div>

        {shelves.map((shelf) => (
          <Shelf key={shelf.id} title={shelf.title} items={shelf.items} />
        ))}
      </div>

      <div className="relative z-10">
        <SiteFooter />
      </div>
    </div>
  );
}

function QuickAccessTile({
  item,
  onHover,
}: {
  item: CardItem;
  onHover: () => void;
}) {
  const { sourceId, isPlaying, toggleSource } = usePlayer();
  const active = sourceId === item.id;
  const playing = active && isPlaying;
  const onToggle = () => toggleSource(item.id, item.playables, item.sourceName);

  return (
    <div
      onMouseEnter={onHover}
      className="group relative flex h-12 items-center gap-2 overflow-hidden rounded bg-white/10 pr-2 transition-colors hover:bg-white/20 md:h-14"
    >
      <CoverArt
        seed={item.coverSeed}
        shape={item.shape}
        variant={item.variant}
        className="h-12 w-12 shrink-0 rounded-none md:h-14 md:w-14"
      />
      <StretchedAction
        href={item.href}
        onClick={onToggle}
        className={cn(
          "line-clamp-2 min-w-0 flex-1 text-left text-xs font-bold after:absolute after:inset-0 md:text-sm",
          active ? "text-spotify-green" : "text-white"
        )}
      >
        {item.title}
      </StretchedAction>
      <PlayButton
        size="sm"
        playing={playing}
        label={item.title}
        onClick={onToggle}
        className={cn(
          "relative z-10 hidden opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100 md:flex",
          playing && "opacity-100"
        )}
      />
    </div>
  );
}
