"use client";

import { ArrowDownCircle, Clock3, PlusCircle, Shuffle } from "lucide-react";
import { formatTotalDuration } from "@/lib/format";
import {
  trackDateAdded,
  tracksToPlayables,
  type Track,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import CollectionTrackRow, {
  COLUMN_LABELS,
  FOURTH_COLUMN,
  THIRD_COLUMN,
  collectionColumns,
  type CollectionKind,
} from "./collection-track-row";
import { MoreIcon, SavedIcon } from "./icons";
import { usePanel } from "./panel-provider";
import PlayButton from "./play-button";
import { usePlayer } from "./player-provider";
import SiteFooter from "./site-footer";
import StickyPlayBar, { useStickyBar } from "./sticky-play-bar";
import TracklistViewMenu from "./tracklist-view-menu";

/** Spotify shrinks long titles to fit. These buckets approximate that. */
export function titleSizeClass(title: string) {
  if (title.length <= 12) return "text-[clamp(2.5rem,9cqw,6rem)]";
  if (title.length <= 24) return "text-[clamp(2rem,6cqw,4.5rem)]";
  return "text-[clamp(1.5rem,3.75cqw,3rem)]";
}

interface CollectionViewProps {
  kind: Exclude<CollectionKind, "artist">;
  /** The player's source id, so cards and this page stay in sync. */
  sourceId: string;
  /** Used to generate each track's mock "Date added". */
  collectionId: string;
  title: string;
  typeLabel: string;
  description?: string;
  /** What comes before the song count in the header's details line. */
  meta: React.ReactNode;
  tint: string;
  cover: React.ReactNode;
  tracks: Track[];
  /** The save toggle in the action bar, when this page can be saved. */
  save?: { saved: boolean; onToggle: () => void };
  /** Shown between the tracklist and the site footer. */
  children?: React.ReactNode;
}

/** The shared layout of the playlist, Liked Songs and album pages. */
export default function CollectionView({
  kind,
  sourceId,
  collectionId,
  title,
  typeLabel,
  description,
  meta,
  tint,
  cover,
  tracks,
  save,
  children,
}: CollectionViewProps) {
  const { sourceId: playerSource, isPlaying, toggleSource, shuffle, toggleShuffle } =
    usePlayer();
  const { tracklistView } = usePanel();
  const { sentinelRef, isStuck } = useStickyBar();

  const { third, fourth, grid } = collectionColumns(kind, tracklistView);
  const playingThis = playerSource === sourceId && isPlaying;
  const hasTracks = tracks.length > 0;
  const totalSeconds = tracks.reduce((sum, t) => sum + t.durationSec, 0);
  const onPlay = () => toggleSource(sourceId, tracksToPlayables(tracks), title);
  const subduedColor = `color-mix(in srgb, ${tint} 25%, white)`;

  return (
    <div className="relative flex min-h-full flex-col">
      <StickyPlayBar
        visible={isStuck}
        title={title}
        tint={tint}
        playing={playingThis}
        onPlay={onPlay}
      />

      <header
        className="flex items-end gap-5 px-4 pb-5 pt-14 md:px-6 [@container_(max-width:520px)]:flex-col [@container_(max-width:520px)]:items-start"
        style={{
          backgroundColor: `color-mix(in srgb, ${tint} 45%, black)`,
          backgroundImage: `linear-gradient(color-mix(in srgb, ${tint} 60%, black), transparent)`,
        }}
      >
        <div className="w-[clamp(128px,22cqw,232px)] shrink-0 shadow-[0_4px_60px_rgba(0,0,0,0.5)]">
          {cover}
        </div>
        <div className="min-w-0 flex-1 text-sm">
          <div className="text-white">{typeLabel}</div>
          <h1
            // The size goes first: a later font size would discard leading-*.
            className={cn(
              titleSizeClass(title),
              "my-1 break-words font-extrabold leading-tight text-white"
            )}
          >
            {title}
          </h1>
          {description && (
            <p className="mb-2 truncate" style={{ color: subduedColor }}>
              {description}
            </p>
          )}
          <div
            className="flex flex-wrap items-center gap-x-1 gap-y-1"
            style={{ color: subduedColor }}
          >
            {meta}
            <span>
              • {tracks.length} {tracks.length === 1 ? "song" : "songs"}
              {hasTracks && `, ${formatTotalDuration(totalSeconds)}`}
            </span>
          </div>
        </div>
      </header>

      <div className="relative flex-1 bg-spotify-base">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[173px]"
          style={{
            backgroundImage: `linear-gradient(color-mix(in srgb, ${tint} 45%, black), transparent)`,
            opacity: 0.7,
          }}
        />

        {/*
          Stacking order: sticky bar (30), this action bar (20), table header
          (10). The view menu lives in this bar and can only ever paint as high
          as the bar itself, so the bar has to sit above the table header it
          opens over.
        */}
        <div className="relative z-20 flex items-center gap-5 px-4 py-5 md:px-6">
          {hasTracks && (
            <PlayButton
              size="lg"
              playing={playingThis}
              label={title}
              onClick={onPlay}
              className="shadow-none"
            />
          )}
          <button
            type="button"
            aria-label={`Enable Shuffle for ${title}`}
            aria-pressed={shuffle}
            onClick={toggleShuffle}
            className={cn(
              "transition hover:scale-105",
              shuffle
                ? "text-spotify-green"
                : "text-spotify-subdued hover:text-white"
            )}
          >
            <Shuffle className="h-7 w-7" />
          </button>
          {save && (
            <button
              type="button"
              aria-label={save.saved ? "Remove from Your Library" : "Save to Your Library"}
              aria-pressed={save.saved}
              onClick={save.onToggle}
              className={cn(
                "transition hover:scale-105",
                save.saved
                  ? "text-spotify-green"
                  : "text-spotify-subdued hover:text-white"
              )}
            >
              {save.saved ? (
                <SavedIcon className="h-8 w-8" />
              ) : (
                <PlusCircle className="h-8 w-8" />
              )}
            </button>
          )}
          <button
            type="button"
            aria-label="Download"
            className="text-spotify-subdued transition hover:scale-105 hover:text-white"
          >
            <ArrowDownCircle className="h-8 w-8" />
          </button>
          <button
            type="button"
            aria-label={`More options for ${title}`}
            className="text-spotify-subdued transition hover:scale-105 hover:text-white"
          >
            <MoreIcon className="h-6 w-6" />
          </button>
          <div className="ml-auto">
            <TracklistViewMenu />
          </div>
        </div>

        <div ref={sentinelRef} aria-hidden="true" className="relative h-px" />

        {hasTracks ? (
          <div
            role="table"
            aria-label={title}
            aria-rowcount={tracks.length + 1}
            className="relative pb-8"
          >
            <div
              role="row"
              aria-rowindex={1}
              className={cn(
                "sticky top-16 z-10 mb-2 px-4 md:px-6",
                isStuck && "bg-[#1a1a1a] shadow-[0_1px_0_rgba(255,255,255,0.1)]"
              )}
            >
              <div
                className={cn(
                  grid,
                  "h-9 text-sm text-spotify-subdued",
                  !isStuck && "border-b border-white/10"
                )}
              >
                <span role="columnheader" className="justify-self-center text-base">
                  #
                </span>
                <span role="columnheader">Title</span>
                {third && (
                  <span role="columnheader" className={THIRD_COLUMN}>
                    {COLUMN_LABELS[third]}
                  </span>
                )}
                {fourth && (
                  <span role="columnheader" className={FOURTH_COLUMN}>
                    {COLUMN_LABELS[fourth]}
                  </span>
                )}
                <span
                  role="columnheader"
                  aria-label="Duration"
                  className="flex justify-end pr-7"
                >
                  <Clock3 className="h-4 w-4" />
                </span>
              </div>
            </div>
            <div role="rowgroup" className="px-4 md:px-6">
              {tracks.map((track, index) => (
                <CollectionTrackRow
                  key={track.id}
                  kind={kind}
                  track={track}
                  index={index}
                  list={tracks}
                  sourceId={sourceId}
                  sourceName={title}
                  dateAdded={trackDateAdded(collectionId, track.id)}
                  view={tracklistView}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <h2 className="mb-2 text-2xl font-bold">Songs you like will appear here</h2>
            <p className="text-sm text-spotify-subdued">
              Save songs by tapping the + icon.
            </p>
          </div>
        )}

        {children}
      </div>

      <SiteFooter />
    </div>
  );
}
