"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { ResizeSource } from "./panel-provider";

interface ResizeHandleProps {
  label: string;
  /** The edge of the panel this handle sits on. */
  edge: "left" | "right";
  min: number;
  max: number;
  value?: number;
  /** Receives the requested width. The panel decides what to do with it. */
  onResize: (candidate: number, source: ResizeSource) => void;
  className?: string;
}

const KEYBOARD_STEP = 10;

/**
 * A draggable strip over the gap beside a panel. Must be a direct child of the
 * panel, whose width is read when a drag or key press starts.
 */
export default function ResizeHandle({
  label,
  edge,
  min,
  max,
  value,
  onResize,
  className,
}: ResizeHandleProps) {
  const drag = useRef<{ startX: number; startWidth: number } | null>(null);
  const panelWidth = (handle: HTMLElement) =>
    handle.parentElement?.getBoundingClientRect().width ?? 0;

  return (
    <div
      role="separator"
      aria-label={label}
      aria-orientation="vertical"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      tabIndex={0}
      onPointerDown={(event) => {
        // Stops the drag from selecting text on the page.
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = {
          startX: event.clientX,
          startWidth: panelWidth(event.currentTarget),
        };
      }}
      onPointerMove={(event) => {
        if (!drag.current) return;
        const moved = event.clientX - drag.current.startX;
        // Moving away from the panel widens it.
        const grown = edge === "right" ? moved : -moved;
        onResize(drag.current.startWidth + grown, "drag");
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerCancel={() => {
        drag.current = null;
      }}
      onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        const grows = event.key === (edge === "right" ? "ArrowRight" : "ArrowLeft");
        onResize(
          panelWidth(event.currentTarget) +
            (grows ? KEYBOARD_STEP : -KEYBOARD_STEP),
          "keyboard"
        );
      }}
      className={cn(
        "group/resizer absolute inset-y-0 z-30 flex w-4 cursor-col-resize touch-none justify-center focus:outline-none",
        edge === "right" ? "-right-3" : "-left-3",
        className
      )}
    >
      <span className="h-full w-px bg-white/30 opacity-0 transition-opacity group-hover/resizer:opacity-100 group-focus-visible/resizer:opacity-100 group-active/resizer:opacity-100" />
    </div>
  );
}
