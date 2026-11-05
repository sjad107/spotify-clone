"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CompactViewIcon, ListViewIcon, MenuCheckIcon } from "./icons";
import { usePanel, type TracklistView } from "./panel-provider";

const OPTIONS = [
  { id: "compact", label: "Compact", Icon: CompactViewIcon },
  { id: "list", label: "List", Icon: ListViewIcon },
] as const;

/** Like the real one, this stays open after an option is picked. */
export default function TracklistViewMenu() {
  const { tracklistView, setTracklistView } = usePanel();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const select = (view: TracklistView) => setTracklistView(view);
  const current = OPTIONS.find((option) => option.id === tracklistView);
  const CurrentIcon = current?.Icon ?? ListViewIcon;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-8 items-center gap-2 rounded px-2 text-sm text-white/70 transition hover:scale-[1.02] hover:text-white"
      >
        {current?.label}
        <CurrentIcon />
      </button>
      {open && (
        <div
          role="menu"
          aria-label="View as"
          className="absolute right-0 top-full z-40 mt-2 w-40 rounded bg-spotify-elevated p-1 shadow-[0_16px_24px_rgba(0,0,0,0.3),0_6px_8px_rgba(0,0,0,0.2)]"
        >
          <div className="px-3 py-3 text-xs font-bold text-spotify-subdued">
            View as
          </div>
          {OPTIONS.map(({ id, label, Icon }) => {
            const selected = id === tracklistView;
            return (
              <button
                key={id}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => select(id)}
                className={cn(
                  "flex h-10 w-full items-center gap-3 rounded-sm px-3 text-left text-sm hover:bg-white/10",
                  selected ? "text-spotify-green" : "text-white/90"
                )}
              >
                <Icon className={selected ? undefined : "text-spotify-subdued"} />
                <span className="flex-1">{label}</span>
                {selected && <MenuCheckIcon />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
