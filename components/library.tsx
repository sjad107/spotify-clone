"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, List, Plus, Search, Volume2, X } from "lucide-react";
import {
  albums,
  artists,
  libraryEntities,
  ownerName,
  playablesFromTrackIds,
  playlists,
  toCard,
  type Entity,
  type CardItem,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import CoverArt from "./cover-art";
import { CollapseLibraryIcon, LibraryIcon, OpenLibraryIcon } from "./icons";
import { useAuth } from "./auth-provider";
import { usePanel } from "./panel-provider";
import { usePlayer } from "./player-provider";

const FILTERS = [
  { id: "playlist", label: "Playlists" },
  { id: "artist", label: "Artists" },
  { id: "album", label: "Albums" },
  { id: "show", label: "Podcasts & Shows" },
] as const;

type LibraryFilter = (typeof FILTERS)[number]["id"];

const LIKED_SOURCE = "liked-songs";
const LIKED_HREF = "/collection/tracks";

function librarySubtitle(entity: Entity, userName?: string): string {
  switch (entity.type) {
    case "playlist":
      return `Playlist • ${ownerName(entity.owner, userName)}`;
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

export function LikedSongsArt({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex aspect-square items-center justify-center rounded bg-gradient-to-br from-[#450af5] to-[#c4efd9]",
        className
      )}
    >
      <Heart className="h-1/3 w-1/3 fill-white text-white" />
    </div>
  );
}

export default function Library({ compact }: { compact: boolean }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { sourceId, isPlaying, toggleSource, likedIds, savedCollectionIds } =
    usePlayer();
  const { setLibraryCompact, followedNames } = usePanel();
  const [filter, setFilter] = useState<LibraryFilter | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const entries = useMemo(() => {
    const needle = text.trim().toLowerCase();
    const isSaved = (e: Entity) => {
      if (e.type === "artist") return followedNames.has(e.name);
      if (e.type === "playlist" || e.type === "album") {
        return savedCollectionIds.has(`${e.type}:${e.id}`);
      }
      return true;
    };
    const newlySaved = [...playlists, ...albums, ...artists].filter(
      (e) => isSaved(e) && !libraryEntities.includes(e)
    );
    return [...newlySaved, ...libraryEntities.filter(isSaved)]
      .filter((entity) => !filter || entity.type === filter)
      .map((entity) => ({
        card: toCard(entity),
        subtitle: librarySubtitle(entity, user?.name),
      }))
      .filter(
        ({ card, subtitle }) =>
          !needle ||
          card.title.toLowerCase().includes(needle) ||
          subtitle.toLowerCase().includes(needle)
      );
  }, [filter, followedNames, savedCollectionIds, text, user?.name]);

  const showLiked =
    (!filter || filter === "playlist") &&
    (!text.trim() || "liked songs".includes(text.trim().toLowerCase()));

  const openSearch = () => {
    setSearchOpen(true);
    // The input mounts on the next render, so focus after this one commits.
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const list = (
    <>
      {showLiked && (
        <LibraryRow
          compact={compact}
          title="Liked Songs"
          subtitle={`Playlist • ${likedIds.size} ${likedIds.size === 1 ? "song" : "songs"}`}
          href={LIKED_HREF}
          selected={pathname === LIKED_HREF}
          active={sourceId === LIKED_SOURCE}
          playing={sourceId === LIKED_SOURCE && isPlaying}
          onClick={() =>
            toggleSource(
              LIKED_SOURCE,
              playablesFromTrackIds([...likedIds]),
              "Liked Songs"
            )
          }
          art={<LikedSongsArt className="h-12 w-12" />}
        />
      )}
      {entries.map(({ card, subtitle }) => (
        <LibraryRow
          key={card.id}
          compact={compact}
          title={card.title}
          subtitle={subtitle}
          href={card.href}
          selected={card.href !== undefined && pathname === card.href}
          active={sourceId === card.id}
          playing={sourceId === card.id && isPlaying}
          onClick={() =>
            toggleSource(card.id, card.playables, card.sourceName)
          }
          art={<LibraryArt card={card} />}
        />
      ))}
    </>
  );

  if (compact) {
    return (
      <div className="flex h-full flex-col">
        <header className="flex flex-col items-center gap-2 px-4 pb-2 pt-4">
          <button
            type="button"
            aria-label="Open Your Library"
            title="Open Your Library"
            onClick={() => setLibraryCompact(false)}
            className="group/open flex h-10 w-10 items-center justify-center text-spotify-subdued transition hover:text-white"
          >
            <LibraryIcon className="group-hover/open:hidden group-focus-visible/open:hidden" />
            <OpenLibraryIcon className="hidden group-hover/open:block group-focus-visible/open:block" />
          </button>
          <button
            type="button"
            aria-label="Create"
            title="Create"
            className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-spotify-highlight text-spotify-subdued transition hover:scale-105 hover:bg-spotify-elevated hover:text-white"
          >
            <Plus className="h-4 w-4" />
          </button>
        </header>
        <ul
          aria-label="Your Library"
          className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-1 pb-1"
        >
          {list}
        </ul>
      </div>
    );
  }

  return (
    <div className="group/library flex h-full flex-col">
      <header className="flex items-center justify-between px-4 pb-2 pt-3">
        <div className="flex min-w-0 items-center">
          {/* Slides open on hover, pushing the title right. */}
          <div className="w-0 shrink-0 overflow-hidden transition-[width] duration-200 focus-within:w-7 group-hover/library:w-7">
            <button
              type="button"
              aria-label="Collapse Your Library"
              title="Collapse Your Library"
              onClick={() => setLibraryCompact(true)}
              className="flex h-8 w-4 items-center text-spotify-subdued transition hover:scale-105 hover:text-white"
            >
              <CollapseLibraryIcon />
            </button>
          </div>
          <h2 className="truncate text-base font-bold">Your Library</h2>
        </div>
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
        {list}
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
  compact,
  title,
  subtitle,
  art,
  href,
  selected,
  active,
  playing,
  onClick,
}: {
  compact: boolean;
  title: string;
  subtitle: string;
  art: React.ReactNode;
  href?: string;
  /** This item's page is open. */
  selected: boolean;
  /** This item is the source of what's in the player. */
  active: boolean;
  playing: boolean;
  onClick: () => void;
}) {
  const className = cn(
    "flex w-full items-center rounded-md p-2 text-left transition-colors hover:bg-white/10",
    compact ? "justify-center" : "gap-3",
    selected && "bg-white/10"
  );

  const contents = compact ? (
    <>
      <span className="shrink-0">{art}</span>
      <span className="sr-only">{title}</span>
    </>
  ) : (
    <>
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
    </>
  );

  return (
    <li>
      {href ? (
        <Link
          href={href}
          title={compact ? title : undefined}
          aria-current={selected ? "page" : undefined}
          className={className}
        >
          {contents}
        </Link>
      ) : (
        <button
          type="button"
          title={compact ? title : undefined}
          onClick={onClick}
          className={className}
        >
          {contents}
        </button>
      )}
    </li>
  );
}
