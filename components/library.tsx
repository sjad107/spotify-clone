"use client";

import { useMemo, useRef, useState } from "react";
import { Heart, List, Plus, Search, Volume2, X } from "lucide-react";
import {
  libraryEntities,
  playablesFromTrackIds,
  toCard,
  type Entity,
  type CardItem,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import CoverArt from "./cover-art";
import { usePlayer } from "./player-provider";

const FILTERS = [
  { id: "playlist", label: "Playlists" },
  { id: "artist", label: "Artists" },
  { id: "album", label: "Albums" },
  { id: "show", label: "Podcasts & Shows" },
] as const;

type LibraryFilter = (typeof FILTERS)[number]["id"];

function librarySubtitle(entity: Entity): string {
  switch (entity.type) {
    case "playlist":
      return `Playlist • ${entity.owner}`;
    case "album":
      return `Album • ${toCard(entity).subtitle}`;
    case "artist":
      return "Artist";
    case "show":
      return `Podcast • ${entity.publisher}`;
    default:
      return "";
  }
}

export default function Library() {
  const { sourceId, isPlaying, toggleSource, likedIds } = usePlayer();
  const [filter, setFilter] = useState<LibraryFilter | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const entries = useMemo(() => {
    const needle = text.trim().toLowerCase();
    return libraryEntities
      .filter((entity) => !filter || entity.type === filter)
      .map((entity) => ({ card: toCard(entity), subtitle: librarySubtitle(entity) }))
      .filter(
        ({ card, subtitle }) =>
          !needle ||
          card.title.toLowerCase().includes(needle) ||
          subtitle.toLowerCase().includes(needle)
      );
  }, [filter, text]);

  const likedItems = useMemo(
    () => playablesFromTrackIds([...likedIds]),
    [likedIds]
  );
  const showLiked =
    (!filter || filter === "playlist") &&
    (!text.trim() || "liked songs".includes(text.trim().toLowerCase()));

  const openSearch = () => {
    setSearchOpen(true);
    // The input mounts on the next render, so focus after this one commits.
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between px-4 pb-2 pt-3">
        <h2 className="truncate text-base font-bold">Your Library</h2>
        <button
          type="button"
          className="flex h-8 shrink-0 items-center gap-2 rounded-full bg-white/10 pl-2 pr-4 text-sm font-bold transition-colors hover:bg-white/20"
        >
          <Plus className="h-4 w-4 text-spotify-subdued" />
          Create
        </button>
      </header>

      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto px-4 py-2">
        {filter && (
          <button
            type="button"
            aria-label="Clear filter"
            onClick={() => setFilter(null)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {FILTERS.filter((option) => !filter || option.id === filter).map(
          (option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={filter === option.id}
              onClick={() => setFilter(option.id)}
              className={cn(
                "h-8 shrink-0 whitespace-nowrap rounded-full px-3 text-sm transition-colors",
                filter === option.id
                  ? "bg-white text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              )}
            >
              {option.label}
            </button>
          )
        )}
      </div>

      <div className="flex items-center justify-between gap-2 px-4 pb-1 pt-1 text-spotify-subdued">
        {searchOpen ? (
          <div className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded bg-white/10 px-2">
            <Search className="h-4 w-4 shrink-0" />
            <input
              ref={inputRef}
              value={text}
              onChange={(event) => setText(event.target.value)}
              onBlur={() => !text && setSearchOpen(false)}
              placeholder="Search in Your Library"
              className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-spotify-subdued focus:outline-none"
            />
          </div>
        ) : (
          <button
            type="button"
            aria-label="Search in Your Library"
            onClick={openSearch}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 hover:text-white"
          >
            <Search className="h-4 w-4" />
          </button>
        )}
        <span className="flex shrink-0 items-center gap-2 text-sm">
          Recents
          <List className="h-4 w-4" />
        </span>
      </div>

      <ul className="spotify-scrollbar min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        {showLiked && (
          <LibraryRow
            title="Liked Songs"
            subtitle={`Playlist • ${likedIds.size} ${likedIds.size === 1 ? "song" : "songs"}`}
            active={sourceId === "liked-songs"}
            playing={sourceId === "liked-songs" && isPlaying}
            onClick={() => toggleSource("liked-songs", likedItems, "Liked Songs")}
            art={
              <div className="flex h-12 w-12 items-center justify-center rounded bg-gradient-to-br from-[#450af5] to-[#c4efd9]">
                <Heart className="h-4 w-4 fill-white text-white" />
              </div>
            }
          />
        )}
        {entries.map(({ card, subtitle }) => (
          <LibraryRow
            key={card.id}
            title={card.title}
            subtitle={subtitle}
            active={sourceId === card.id}
            playing={sourceId === card.id && isPlaying}
            onClick={() => toggleSource(card.id, card.playables, card.sourceName)}
            art={<LibraryArt card={card} />}
          />
        ))}
        {entries.length === 0 && !showLiked && (
          <li className="px-2 py-6 text-center text-sm text-spotify-subdued">
            Couldn&apos;t find anything for &ldquo;{text}&rdquo;
          </li>
        )}
      </ul>
    </div>
  );
}

function LibraryArt({ card }: { card: CardItem }) {
  return (
    <CoverArt
      seed={card.coverSeed}
      shape={card.shape}
      variant={card.variant}
      className={cn("h-12 w-12", card.shape === "square" && "rounded")}
    />
  );
}

function LibraryRow({
  title,
  subtitle,
  art,
  active,
  playing,
  onClick,
}: {
  title: string;
  subtitle: string;
  art: React.ReactNode;
  active: boolean;
  playing: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-white/10",
          active && "bg-white/5"
        )}
      >
        <span className="shrink-0">{art}</span>
        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "block truncate text-base leading-snug",
              active ? "text-spotify-green" : "text-white"
            )}
          >
            {title}
          </span>
          <span className="block truncate text-sm leading-snug text-spotify-subdued">
            {subtitle}
          </span>
        </span>
        {playing && (
          <Volume2 className="h-4 w-4 shrink-0 text-spotify-green" aria-label="Playing" />
        )}
      </button>
    </li>
  );
}
