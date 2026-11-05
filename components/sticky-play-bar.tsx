"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import PlayButton from "./play-button";

const STICKY_BAR_HEIGHT = 64;

/**
 * Tells a page when its sticky bar should show. Put sentinelRef on an element
 * at the point where the bar takes over: once that scrolls under the bar,
 * isStuck turns true.
 */
export function useStickyBar() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) =>
        setIsStuck(
          entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0)
        ),
      {
        root: sentinel.closest("main"),
        rootMargin: `-${STICKY_BAR_HEIGHT}px 0px 0px 0px`,
      }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return { sentinelRef, isStuck };
}

interface StickyPlayBarProps {
  visible: boolean;
  title: string;
  tint: string;
  playing: boolean;
  onPlay: () => void;
}

/** The tinted bar with Play and the title. Takes no space in the page flow. */
export default function StickyPlayBar({
  visible,
  title,
  tint,
  playing,
  onPlay,
}: StickyPlayBarProps) {
  return (
    <div
      className={cn(
        "sticky top-0 z-30 -mb-16 flex h-16 items-center gap-3 px-4 transition-opacity duration-200",
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
      style={{ backgroundColor: `color-mix(in srgb, ${tint} 35%, black)` }}
    >
      <PlayButton
        playing={playing}
        label={title}
        onClick={onPlay}
        className="shadow-none"
      />
      <span className="truncate text-2xl font-bold text-white">{title}</span>
    </div>
  );
}
