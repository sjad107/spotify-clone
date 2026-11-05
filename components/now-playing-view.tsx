"use client";

import { Fragment } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { searchHref } from "@/lib/format";
import type { Playable } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import CoverArt from "./cover-art";
import CreditsList from "./credits-list";
import { ExpandViewIcon, HidePanelIcon, SavedIcon, ShareIcon } from "./icons";
import { usePanel } from "./panel-provider";
import { usePlayer } from "./player-provider";
import QueueRow from "./queue-row";
import TrackMenu from "./track-menu";

const PANEL_CREDIT_COUNT = 2;

/** The contents of the open panel. Expects a `group/panel` ancestor. */
export default function NowPlayingView() {
  const { current, sourceName } = usePlayer();
  const { setCollapsed, setExpanded } = usePanel();

  if (!current) return null;

  return (
    <div className="relative h-full">
      <header className="absolute inset-x-0 top-0 z-20 flex h-16 items-center bg-spotify-base px-4">
        {/* Slides open on hover, pushing the title right. */}
        <div className="w-0 shrink-0 overflow-hidden transition-[width] duration-200 focus-within:w-7 group-hover/panel:w-7">
          <button
            type="button"
            aria-label="Hide Now Playing view"
            onClick={() => setCollapsed(true)}
            className="flex h-8 w-4 items-center text-spotify-subdued transition hover:scale-105 hover:text-white"
          >
            <HidePanelIcon />
          </button>
        </div>
        <h2 className="min-w-0 flex-1 truncate text-base font-bold text-white">
          {sourceName}
        </h2>
        <div className="flex shrink-0 opacity-0 transition-opacity duration-200 focus-within:opacity-100 group-hover/panel:opacity-100">
          <TrackMenu item={current} />
          <button
            type="button"
            aria-label="Expand Now Playing view"
            onClick={() => setExpanded(true)}
            className="flex h-8 w-8 items-center justify-center text-spotify-subdued transition hover:scale-105 hover:text-white"
          >
            <ExpandViewIcon />
          </button>
        </div>
      </header>

      <div className="panel-scrollbar h-full overflow-y-auto pb-4 pl-4 pr-2 pt-16">
        <div className="flex flex-col gap-4">
          <CoverArt seed={current.coverSeed} className="rounded-lg" />
          <TrackHeading item={current} />
          <CreditsCard item={current} />
          <NextInQueueCard />
        </div>
      </div>
    </div>
  );
}

export function TrackHeading({
  item,
  className,
}: {
  item: Playable;
  className?: string;
}) {
  const { likedIds, toggleLike } = usePlayer();
  const { copyLink } = usePanel();
  const liked = likedIds.has(item.id);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="min-w-0 flex-1">
        <div className="truncate text-2xl font-bold text-white">
          <Link href={searchHref(item.title)} className="hover:underline">
            {item.title}
          </Link>
        </div>
        <div className="truncate text-sm text-spotify-subdued">
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
      <div className="flex shrink-0 items-center">
        {/* Hidden at zero width until the panel is hovered. */}
        <button
          type="button"
          aria-label="Copy link to Song"
          onClick={() => copyLink(item.title)}
          className="mr-3 w-0 overflow-hidden text-spotify-subdued opacity-0 transition-[width,opacity,transform] duration-200 hover:scale-105 hover:text-white focus-visible:w-6 focus-visible:opacity-100 group-hover/panel:w-6 group-hover/panel:opacity-100"
        >
          <ShareIcon />
        </button>
        <button
          type="button"
          aria-label={liked ? "Remove from Liked Songs" : "Save to Liked Songs"}
          aria-pressed={liked}
          onClick={() => toggleLike(item.id)}
          className={cn(
            "flex h-12 w-6 items-center justify-center transition hover:scale-105",
            liked
              ? "text-spotify-green"
              : "text-spotify-subdued hover:text-white"
          )}
        >
          {liked ? <SavedIcon /> : <PlusCircle className="h-6 w-6" />}
        </button>
      </div>
    </div>
  );
}

function PanelCard({
  title,
  action,
  onAction,
  children,
}: {
  title: string;
  action: string;
  onAction: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg bg-spotify-highlight p-4">
      <div className="mb-2 flex h-8 items-center justify-between gap-3">
        <h2 className="truncate text-base font-bold text-white">{title}</h2>
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 text-sm font-bold text-spotify-subdued transition hover:scale-105 hover:text-white hover:underline"
        >
          {action}
        </button>
      </div>
      {children}
    </section>
  );
}

export function CreditsCard({ item }: { item: Playable }) {
  const { setCreditsOpen } = usePanel();
  return (
    <PanelCard
      title="Credits"
      action="Show all"
      onAction={() => setCreditsOpen(true)}
    >
      <CreditsList credits={item.credits.slice(0, PANEL_CREDIT_COUNT)} />
    </PanelCard>
  );
}

export function NextInQueueCard() {
  const { upNext, skipTo } = usePlayer();
  const { toggleQueue } = usePanel();

  if (upNext.length === 0) return null;

  return (
    <PanelCard
      title="Next in queue"
      action="Open queue"
      onAction={toggleQueue}
    >
      <div className="-mx-2">
        <QueueRow item={upNext[0]} onPlay={() => skipTo(0)} />
      </div>
    </PanelCard>
  );
}
