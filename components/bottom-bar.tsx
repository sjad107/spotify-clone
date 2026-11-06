"use client";

import {
  CheckCircle2,
  ListMusic,
  Maximize2,
  MonitorSpeaker,
  PictureInPicture2,
  PlusCircle,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Fragment } from "react";
import { formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";
import ArtistLink from "./artist-link";
import { useAuth } from "./auth-provider";
import { useCloneNotice } from "./clone-notice";
import PreviewBanner from "./preview-banner";
import CoverArt from "./cover-art";
import ExplicitBadge from "./explicit-badge";
import { LyricsIcon } from "./icons";
import { usePanel } from "./panel-provider";
import { PauseGlyph, PlayGlyph } from "./play-button";
import PlayerSlider from "./player-slider";
import SongLink from "./song-link";
import { usePlayer, usePlayerProgress } from "./player-provider";

const ICON_BUTTON =
  "relative flex h-8 w-8 shrink-0 items-center justify-center text-spotify-subdued transition hover:scale-105 hover:text-white";

function ToggleDot({ on }: { on: boolean }) {
  if (!on) return null;
  return (
    <span className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-spotify-green" />
  );
}

function ProgressBar() {
  const { current, seek } = usePlayer();
  const progress = usePlayerProgress();
  const duration = current?.durationSec ?? 0;

  return (
    <div className="flex w-full items-center gap-2 text-xs tabular-nums text-spotify-subdued">
      <span className="w-10 text-right">{formatDuration(progress)}</span>
      <PlayerSlider
        label="Change progress"
        value={Math.min(progress, duration)}
        max={duration}
        onChange={seek}
      />
      <span className="w-10">{formatDuration(duration)}</span>
    </div>
  );
}

function PlaybackControls() {
  const {
    isPlaying,
    togglePlay,
    next,
    previous,
    shuffle,
    toggleShuffle,
    repeat,
    cycleRepeat,
  } = usePlayer();
  const Glyph = isPlaying ? PauseGlyph : PlayGlyph;
  const RepeatIcon = repeat === "one" ? Repeat1 : Repeat;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Enable shuffle"
        aria-pressed={shuffle}
        onClick={toggleShuffle}
        className={cn(ICON_BUTTON, shuffle && "text-spotify-green hover:text-spotify-green")}
      >
        <Shuffle className="h-4 w-4" />
        <ToggleDot on={shuffle} />
      </button>
      <button type="button" aria-label="Previous" onClick={previous} className={ICON_BUTTON}>
        <SkipBack className="h-4 w-4 fill-current" />
      </button>
      <button
        type="button"
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={togglePlay}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition hover:scale-105"
      >
        <Glyph className="h-4 w-4" />
      </button>
      <button type="button" aria-label="Next" onClick={next} className={ICON_BUTTON}>
        <SkipForward className="h-4 w-4 fill-current" />
      </button>
      <button
        type="button"
        aria-label="Repeat"
        aria-pressed={repeat !== "off"}
        onClick={cycleRepeat}
        className={cn(
          ICON_BUTTON,
          repeat !== "off" && "text-spotify-green hover:text-spotify-green"
        )}
      >
        <RepeatIcon className="h-4 w-4" />
        <ToggleDot on={repeat !== "off"} />
      </button>
    </div>
  );
}

function VolumeControl() {
  const { volume, muted, setVolume, toggleMute } = usePlayer();
  const level = muted ? 0 : volume;
  const Icon = level === 0 ? VolumeX : level < 0.5 ? Volume1 : Volume2;

  return (
    <div className="flex items-center">
      <button
        type="button"
        aria-label={muted ? "Unmute" : "Mute"}
        onClick={toggleMute}
        className={ICON_BUTTON}
      >
        <Icon className="h-4 w-4" />
      </button>
      <PlayerSlider
        label="Change volume"
        value={level}
        max={1}
        step={0.01}
        onChange={setVolume}
        className="!w-[93px]"
      />
    </div>
  );
}

const BottomBar = ({ className }: { className?: string }) => {
  const { user } = useAuth();
  return user ? <PlayerBar className={className} /> : <PreviewBanner />;
};

const PlayerBar = ({ className }: { className?: string }) => {
  const { current, likedIds, toggleLike, isPlaying, togglePlay } = usePlayer();
  const { view, collapsed, toggleNowPlaying, toggleQueue } = usePanel();
  const { showCloneNotice } = useCloneNotice();
  const queueOpen = !collapsed && view === "queue";
  const liked = current ? likedIds.has(current.id) : false;
  const LikeIcon = liked ? CheckCircle2 : PlusCircle;
  const MobileGlyph = isPlaying ? PauseGlyph : PlayGlyph;

  return (
    <footer
      className={cn(
        "grid h-16 w-full shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 bg-black px-3 md:h-[72px] md:grid-cols-[minmax(0,3fr)_minmax(0,4fr)_minmax(0,3fr)] md:px-4",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {current && (
          <>
            <button
              type="button"
              aria-label="Now playing view"
              onClick={toggleNowPlaying}
              className="h-12 w-12 shrink-0 md:h-14 md:w-14"
            >
              <CoverArt seed={current.coverSeed} className="rounded" />
            </button>
            <div className="min-w-0">
              <div className="truncate text-sm text-white">
                <SongLink title={current.title} albumId={current.albumId} />
              </div>
              <div className="truncate text-xs text-spotify-subdued">
                {current.explicit && <ExplicitBadge />}
                {current.artists.map((name, position) => (
                  <Fragment key={name}>
                    {position > 0 && ", "}
                    <ArtistLink
                      name={name}
                      className="hover:text-white hover:underline"
                    />
                  </Fragment>
                ))}
              </div>
            </div>
            <button
              type="button"
              aria-label={liked ? "Remove from Liked Songs" : "Save to Liked Songs"}
              aria-pressed={liked}
              onClick={() => toggleLike(current.id)}
              className={cn(
                ICON_BUTTON,
                liked && "text-spotify-green hover:text-spotify-green"
              )}
            >
              <LikeIcon className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={togglePlay}
        className="flex h-10 w-10 items-center justify-center text-white md:hidden"
      >
        <MobileGlyph className="h-6 w-6" />
      </button>

      <div className="hidden min-w-0 flex-col items-center gap-1 md:flex">
        <PlaybackControls />
        <ProgressBar />
      </div>

      <div className="hidden items-center justify-end md:flex">
        <button
          type="button"
          disabled
          aria-label="Looks like we don't have the lyrics for this song."
          className="hidden h-8 w-8 shrink-0 items-center justify-center text-spotify-subdued opacity-30 xl:flex"
        >
          <LyricsIcon />
        </button>
        <button
          type="button"
          aria-label="Queue"
          aria-pressed={queueOpen}
          onClick={toggleQueue}
          className={cn(
            ICON_BUTTON,
            "hidden lg:flex",
            queueOpen && "text-spotify-green hover:text-spotify-green"
          )}
        >
          <ListMusic className="h-4 w-4" />
          <ToggleDot on={queueOpen} />
        </button>
        <button type="button" aria-label="Connect to a device" onClick={() => showCloneNotice("Connect to a device")} className={cn(ICON_BUTTON, "hidden lg:flex")}>
          <MonitorSpeaker className="h-4 w-4" />
        </button>
        <VolumeControl />
        <button type="button" aria-label="Open Miniplayer" onClick={() => showCloneNotice("Miniplayer")} className={cn(ICON_BUTTON, "hidden xl:flex")}>
          <PictureInPicture2 className="h-4 w-4" />
        </button>
        <button type="button" aria-label="Enter Full screen" onClick={() => showCloneNotice("Full screen")} className={cn(ICON_BUTTON, "hidden xl:flex")}>
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    </footer>
  );
};

export default BottomBar;
