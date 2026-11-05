"use client";

import { useEffect, useRef, useState } from "react";
import { coverColor } from "@/lib/cover";
import { cn } from "@/lib/utils";
import CoverArt from "./cover-art";
import {
  ArtistImageIcon,
  ArtworkIcon,
  CanvasIcon,
  FullScreenIcon,
  LyricsIcon,
  MinimizeViewIcon,
} from "./icons";
import { CreditsCard, NextInQueueCard, TrackHeading } from "./now-playing-view";
import { usePanel } from "./panel-provider";
import { usePlayer } from "./player-provider";
import TrackMenu from "./track-menu";

const TOOLBAR_BUTTON =
  "flex h-8 w-8 items-center justify-center rounded-full transition hover:scale-105 hover:text-white";

/** The Expand view, covering the area between the navbar and player bar. */
export default function NowPlayingExpanded() {
  const { current, sourceName } = usePlayer();
  const { expanded, setExpanded } = usePanel();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullScreen(document.fullscreenElement !== null);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  if (!expanded || !current) return null;

  const tint = coverColor(current.coverSeed);
  const toolbarColor = `color-mix(in srgb, ${tint} 30%, white)`;

  const toggleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      rootRef.current?.requestFullscreen();
    }
  };

  const minimize = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    setExpanded(false);
  };

  return (
    <div
      ref={rootRef}
      role="region"
      aria-label="Expanded Now Playing view"
      className="group/panel spotify-scrollbar absolute inset-y-0 inset-x-2 z-40 hidden overflow-y-auto rounded-lg lg:block"
      style={{
        background: `linear-gradient(${tint}, color-mix(in srgb, ${tint} 55%, black))`,
      }}
    >
      <header
        className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 px-6 pr-4"
        style={{ color: toolbarColor }}
      >
        <h2 className="min-w-0 truncate text-base font-bold text-white">
          {sourceName}
        </h2>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="Show artwork"
            aria-pressed="true"
            className={cn(TOOLBAR_BUTTON, "relative text-white")}
          >
            <ArtworkIcon />
            <span className="absolute bottom-0 h-1 w-1 rounded-full bg-white" />
          </button>
          {/* Disabled like the real app when a song has none of these. */}
          <button type="button" disabled aria-label="Show Canvas" className="flex h-8 w-8 items-center justify-center opacity-30">
            <CanvasIcon />
          </button>
          <button type="button" disabled aria-label="Show artist image" className="flex h-8 w-8 items-center justify-center opacity-30">
            <ArtistImageIcon />
          </button>
          <button type="button" disabled aria-label="Show lyrics" className="flex h-8 w-8 items-center justify-center opacity-30">
            <LyricsIcon />
          </button>
          <span className="mx-2 h-6 w-px bg-current opacity-40" aria-hidden="true" />
          <TrackMenu
            item={current}
            label={`More options for ${current.title}`}
            buttonClassName="text-inherit"
          />
          <button
            type="button"
            aria-label={isFullScreen ? "Exit Full screen" : "Enter Full screen"}
            onClick={toggleFullScreen}
            className={TOOLBAR_BUTTON}
          >
            <FullScreenIcon />
          </button>
          <button
            type="button"
            aria-label="Minimize Now Playing view"
            onClick={minimize}
            className={TOOLBAR_BUTTON}
          >
            <MinimizeViewIcon />
          </button>
        </div>
      </header>

      {/* Centred in the whole view, so the sticky header overlaps its box. */}
      <div className="-mt-16 flex h-full min-h-[320px] items-center justify-center">
        <CoverArt
          seed={current.coverSeed}
          className="!w-auto h-[70%] max-h-[513px] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
        />
      </div>

      <div className="mx-auto flex max-w-[560px] flex-col gap-4 px-4 pb-8 pt-4">
        <TrackHeading item={current} />
        <CreditsCard item={current} />
        <NextInQueueCard />
      </div>
    </div>
  );
}
