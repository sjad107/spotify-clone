"use client";

import Link from "next/link";
import { Fragment } from "react";
import { CheckCircle2, MoreHorizontal, PlusCircle } from "lucide-react";
import { albumHref, formatDuration } from "@/lib/format";
import {
  albumById,
  artistById,
  tracksToPlayables,
  type Track,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import ArtistLink from "./artist-link";
import CoverArt from "./cover-art";
import ExplicitBadge from "./explicit-badge";
import { PauseGlyph, PlayGlyph } from "./play-button";
import { usePlayer } from "./player-provider";
import SongLink from "./song-link";

interface TrackRowProps {
  track: Track;
  /** The whole list, which becomes the queue when this row is played. */
  list: Track[];
  listId: string;
  listName: string;
  index: number;
  /** Adds the number and album columns used by the full Songs table. */
  detailed?: boolean;
}

export const TRACK_TABLE_COLUMNS =
  "grid-cols-[minmax(0,1fr)_auto] [@container_(min-width:560px)]:grid-cols-[24px_minmax(0,4fr)_minmax(0,3fr)_auto]";

export default function TrackRow({
  track,
  list,
  listId,
  listName,
  index,
  detailed = false,
}: TrackRowProps) {
  const { current, isPlaying, play, togglePlay, likedIds, toggleLike } =
    usePlayer();
  const active = current?.id === track.id;
  const playing = active && isPlaying;
  const liked = likedIds.has(track.id);

  const onPlay = () => {
    if (active) {
      togglePlay();
    } else {
      play(listId, tracksToPlayables(list), index, listName);
    }
  };

  const Glyph = playing ? PauseGlyph : PlayGlyph;
  const LikeIcon = liked ? CheckCircle2 : PlusCircle;

  return (
    <div
      onDoubleClick={onPlay}
      className={cn(
        "group grid h-14 items-center gap-3 rounded px-2 hover:bg-white/10 focus-within:bg-white/10",
        detailed ? TRACK_TABLE_COLUMNS : "grid-cols-[minmax(0,1fr)_auto]"
      )}
    >
      {detailed && (
        <span
          className={cn(
            "hidden text-right tabular-nums [@container_(min-width:560px)]:block",
            active ? "text-spotify-green" : "text-spotify-subdued"
          )}
        >
          {index + 1}
        </span>
      )}

      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-10 w-10 shrink-0">
          <CoverArt seed={track.albumId} className="rounded" />
          <button
            type="button"
            aria-label={`${playing ? "Pause" : "Play"} ${track.title}`}
            onClick={onPlay}
            className="absolute inset-0 flex items-center justify-center rounded bg-black/50 text-white opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
          >
            <Glyph className="h-4 w-4" />
          </button>
        </div>
        <div className="min-w-0">
          <div
            className={cn(
              "truncate text-base leading-snug",
              active ? "text-spotify-green" : "text-white"
            )}
          >
            <SongLink title={track.title} albumId={track.albumId} />
          </div>
          <div className="truncate text-sm leading-snug text-spotify-subdued">
            {track.explicit && <ExplicitBadge />}
            {track.artistIds.map((id, position) => (
              <Fragment key={id}>
                {position > 0 && ", "}
                <ArtistLink
                  name={artistById(id)?.name ?? ""}
                  className="hover:text-white hover:underline"
                />
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {detailed && (
        <span className="hidden truncate text-sm text-spotify-subdued [@container_(min-width:560px)]:block">
          <Link href={albumHref(track.albumId)} className="hover:underline">
            {albumById(track.albumId)?.title}
          </Link>
        </span>
      )}

      <div className="flex items-center gap-3 text-spotify-subdued">
        <button
          type="button"
          aria-label={liked ? "Remove from Liked Songs" : "Save to Liked Songs"}
          aria-pressed={liked}
          onClick={() => toggleLike(track.id)}
          className={cn(
            "transition-opacity hover:scale-105 focus-visible:opacity-100",
            liked
              ? "text-spotify-green"
              : "opacity-0 hover:text-white group-hover:opacity-100"
          )}
        >
          <LikeIcon className="h-4 w-4" />
        </button>
        <span className="w-10 text-right text-sm tabular-nums">
          {formatDuration(track.durationSec)}
        </span>
        <button
          type="button"
          aria-label={`More options for ${track.title}`}
          className="opacity-0 transition-opacity hover:text-white focus-visible:opacity-100 group-hover:opacity-100"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
