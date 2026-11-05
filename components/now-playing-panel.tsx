"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ShowPanelChevronIcon } from "./icons";
import NowPlayingView from "./now-playing-view";
import { usePanel } from "./panel-provider";
import QueueView from "./queue-view";

const MIN_WIDTH = 280;
const MAX_WIDTH = 420;
const DEFAULT_WIDTH = 390;
const KEYBOARD_STEP = 10;

const clampWidth = (width: number) =>
  Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, width));

/**
 * The right-hand panel. Minimizing doesn't remove it: the panel keeps its full
 * width and is clipped to a 44px strip, with a 90% opaque layer over the real
 * content so it stays faintly visible behind the chevron. The layout changes
 * immediately and the content then slides into place (see globals.css).
 */
export default function NowPlayingPanel() {
  const { view, collapsed, slide, setCollapsed } = usePanel();
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const contentRef = useRef<HTMLDivElement>(null);

  // The dimmed content stays visible but mustn't be reachable by keyboard.
  // React 18 can't set inert as a prop, so it goes on the element directly.
  useEffect(() => {
    if (contentRef.current) contentRef.current.inert = collapsed;
  }, [collapsed]);

  return (
    <aside
      aria-label={view === "queue" ? "Queue" : "Now playing view"}
      className={cn(
        "relative hidden h-full shrink-0 lg:block",
        "lg:[--panel-w:280px] xl:[--panel-w:var(--panel-width)]",
        collapsed ? "w-11" : "w-[var(--panel-w)]"
      )}
      style={{ "--panel-width": `${width}px` } as React.CSSProperties}
    >
      {!collapsed && <PanelResizer width={width} onChange={setWidth} />}

      <div className="relative h-full overflow-hidden rounded-lg bg-spotify-base">
        <div
          ref={contentRef}
          className={cn(
            "group/panel absolute inset-y-0 left-0 w-[var(--panel-w)]",
            slide === "open" && "panel-slide-open",
            slide === "close" && "panel-slide-close"
          )}
        >
          {view === "queue" ? <QueueView /> : <NowPlayingView />}
        </div>

        <button
          type="button"
          aria-label="Show Now Playing view"
          disabled={!collapsed}
          onClick={() => setCollapsed(false)}
          className={cn(
            "absolute inset-0 z-30 rounded-lg bg-spotify-base text-white transition-opacity duration-300 ease-in",
            collapsed ? "cursor-pointer opacity-90" : "pointer-events-none opacity-0"
          )}
        >
          <span className="absolute left-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center">
            <ShowPanelChevronIcon />
          </span>
        </button>
      </div>
    </aside>
  );
}

/** Sits over the gap beside the panel. Only available from the xl breakpoint. */
function PanelResizer({
  width,
  onChange,
}: {
  width: number;
  onChange: (width: number) => void;
}) {
  const drag = useRef<{ startX: number; startWidth: number } | null>(null);

  return (
    <div
      role="separator"
      aria-label="Resize Now Playing view"
      aria-orientation="vertical"
      aria-valuemin={MIN_WIDTH}
      aria-valuemax={MAX_WIDTH}
      aria-valuenow={width}
      tabIndex={0}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = { startX: event.clientX, startWidth: width };
      }}
      onPointerMove={(event) => {
        if (!drag.current) return;
        // The handle is on the panel's left edge, so moving left widens it.
        const moved = drag.current.startX - event.clientX;
        onChange(clampWidth(drag.current.startWidth + moved));
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerCancel={() => {
        drag.current = null;
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          onChange(clampWidth(width + KEYBOARD_STEP));
        } else if (event.key === "ArrowRight") {
          onChange(clampWidth(width - KEYBOARD_STEP));
        }
      }}
      className="group/resizer absolute -left-3 inset-y-0 z-30 hidden w-4 cursor-col-resize touch-none justify-center focus:outline-none xl:flex"
    >
      <span className="h-full w-px bg-white/30 opacity-0 transition-opacity group-hover/resizer:opacity-100 group-focus-visible/resizer:opacity-100 group-active/resizer:opacity-100" />
    </div>
  );
}
