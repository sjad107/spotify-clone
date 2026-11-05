"use client";

import { Fragment } from "react";
import Link from "next/link";
import { CheckCircle2, PlusCircle } from "lucide-react";
import { albumHref, formatDuration } from "@/lib/format";
import {
  albumById,
  artistById,
  trackPlays,
  tracksToPlayables,
  type Track,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import ArtistLink from "./artist-link";
import CoverArt from "./cover-art";
import ExplicitBadge from "./explicit-badge";
import type { TracklistView } from "./panel-provider";
import { PauseGlyph, PlayGlyph } from "./play-button";
import { usePlayer } from "./player-provider";
import SongLink from "./song-link";
import TrackMenu from "./track-menu";

export type CollectionKind = "playlist" | "album" | "artist" | "profile";
type ColumnId = "album" | "artist" | "date" | "plays";

/**
 * Every tracklist has a number, title and a fixed last column. What goes
 * between them depends on the page and view. Columns drop out as the main
 * view gets narrower.
 */
const COLUMNS: Record<
  CollectionKind,
  Record<TracklistView, { third?: ColumnId; fourth?: ColumnId }>
> = {
  playlist: {
    list: { third: "album", fourth: "date" },
    compact: { third: "artist", fourth: "album" },
  },
  album: {
    list: {},
    compact: { third: "artist" },
  },
  artist: {
    list: { third: "plays" },
    compact: { third: "plays" },
  },
  profile: {
    list: { third: "album" },
    compact: { third: "album" },
  },
};

export const COLUMN_LABELS: Record<ColumnId, string> = {
  album: "Album",
  artist: "Artist",
  date: "Date added",
  plays: "Plays",
};

const BASE_GRID =
  "grid items-center gap-x-4 px-4 grid-cols-[16px_minmax(0,1fr)_120px]";
const THIRD_COLUMN_GRID =
  "[@container_(min-width:560px)]:grid-cols-[16px_minmax(0,2fr)_minmax(0,1fr)_120px]";
const FOURTH_COLUMN_GRID =
  "[@container_(min-width:760px)]:grid-cols-[16px_minmax(0,4fr)_minmax(0,2fr)_minmax(0,2fr)_120px]";

export const THIRD_COLUMN =
  "hidden min-w-0 [@container_(min-width:560px)]:block";
export const FOURTH_COLUMN =
  "hidden min-w-0 [@container_(min-width:760px)]:block";

export function collectionColumns(kind: CollectionKind, view: TracklistView) {
  const { third, fourth } = COLUMNS[kind][view];
  return {
    third,
    fourth,
    grid: cn(
      BASE_GRID,
      third && THIRD_COLUMN_GRID,
      fourth && FOURTH_COLUMN_GRID
    ),
  };
}

function PlayingBars() {
  return (
    <span aria-hidden="true" className="flex h-3.5 items-end justify-center gap-0.5">
      {[0, 0.3, 0.15, 0.45].map((delay) => (
        <span
          key={delay}
          className="playing-bar h-full w-0.5 bg-spotify-green"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </span>
  );
}

interface CollectionTrackRowProps {
  kind: CollectionKind;
  track: Track;
  index: number;
  list: Track[];
  sourceId: string;
  sourceName: string;
  dateAdded?: string;
  view: TracklistView;
}

export default function CollectionTrackRow({
  kind,
  track,
  index,
  list,
  sourceId,
  sourceName,
  dateAdded,
  view,
}: CollectionTrackRowProps) {
  const { current, isPlaying, play, togglePlay, likedIds, toggleLike } =
    usePlayer();
  const active = current?.id === track.id;
  const playing = active && isPlaying;
  const liked = likedIds.has(track.id);
  const compact = view === "compact";
  const { third, fourth, grid } = collectionColumns(kind, view);

  const onPlay = () => {
    if (active) {
      togglePlay();
    } else {
      play(sourceId, tracksToPlayables(list), index, sourceName);
    }
  };

  const Glyph = playing ? PauseGlyph : PlayGlyph;
  const LikeIcon = liked ? CheckCircle2 : PlusCircle;
  const secondaryLink =
    "hover:underline group-hover/track:text-white group-focus-within/track:text-white";

  const artists = (
    <>
      {track.explicit && <ExplicitBadge />}
      {track.artistIds.map((id, position) => {
        const name = artistById(id)?.name ?? "";
        return (
          <Fragment key={id}>
            {position > 0 && ", "}
            <ArtistLink name={name} className={secondaryLink} />
          </Fragment>
        );
      })}
    </>
  );

  const renderColumn = (column: ColumnId) => {
    switch (column) {
      case "artist":
        return artists;
      case "album":
        return (
          <Link href={albumHref(track.albumId)} className={secondaryLink}>
            {albumById(track.albumId)?.title}
          </Link>
        );
      case "date":
        return dateAdded;
      case "plays":
        return (
          <span className="inline-block w-[101px] text-right tabular-nums">
            {trackPlays(track).toLocaleString("en-US")}
          </span>
        );
    }
  };

  return (
    <div
      role="row"
      aria-rowindex={index + 2}
      onDoubleClick={onPlay}
      className={cn(
        grid,
        "group/track rounded hover:bg-white/10 focus-within:bg-white/10",
        compact ? "h-8" : "h-14"
      )}
    >
      <div className="relative flex h-4 w-4 items-center justify-center justify-self-center">
        <span
          className={cn(
            "tabular-nums group-hover/track:invisible group-focus-within/track:invisible",
            active ? "text-spotify-green" : "text-spotify-subdued"
          )}
        >
          {playing ? <PlayingBars /> : index + 1}
        </span>
        <button
          type="button"
          aria-label={`${playing ? "Pause" : "Play"} ${track.title}`}
          onClick={onPlay}
          className="absolute inset-0 flex items-center justify-center text-white opacity-0 focus-visible:opacity-100 group-hover/track:opacity-100"
        >
          <Glyph className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex min-w-0 items-center gap-3">
        {kind !== "album" && !compact && (
          <CoverArt seed={track.albumId} className="h-10 w-10 shrink-0 rounded" />
        )}
        <div className="min-w-0">
          <div
            className={cn(
              "truncate text-base leading-snug",
              active ? "text-spotify-green" : "text-white"
            )}
          >
            {/* An album's own songs have nowhere further to go. */}
            {kind === "album" ? (
              track.title
            ) : (
              <SongLink title={track.title} albumId={track.albumId} />
            )}
          </div>
          {!compact && (
            <div className="truncate text-sm leading-snug text-spotify-subdued">
              {artists}
            </div>
          )}
        </div>
      </div>

      {third && (
        <div className={cn(THIRD_COLUMN, "truncate text-sm text-spotify-subdued")}>
          {renderColumn(third)}
        </div>
      )}
      {fourth && (
        <div className={cn(FOURTH_COLUMN, "truncate text-sm text-spotify-subdued")}>
          {renderColumn(fourth)}
        </div>
      )}

      <div className="flex items-center justify-end gap-3 text-spotify-subdued">
        <button
          type="button"
          aria-label={liked ? "Remove from Liked Songs" : "Save to Liked Songs"}
          aria-pressed={liked}
          onClick={() => toggleLike(track.id)}
          className={cn(
            "transition hover:scale-105 focus-visible:opacity-100",
            liked
              ? "text-spotify-green"
              : "opacity-0 hover:text-white group-hover/track:opacity-100"
          )}
        >
          <LikeIcon className="h-4 w-4" />
        </button>
        <span className="w-10 text-right text-sm tabular-nums">
          {formatDuration(track.durationSec)}
        </span>
        <TrackMenu
          item={tracksToPlayables([track])[0]}
          label={`More options for ${track.title}`}
          buttonClassName="h-4 w-4 opacity-0 focus-visible:opacity-100 group-hover/track:opacity-100 aria-expanded:opacity-100"
        />
      </div>
    </div>
  );
}
