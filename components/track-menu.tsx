"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Ban,
  CheckCircle2,
  Disc3,
  FileText,
  ListEnd,
  MonitorDown,
  Plus,
  PlusCircle,
  Radio,
  Share2,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { searchHref } from "@/lib/format";
import type { Playable } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { MoreIcon } from "./icons";
import { usePanel } from "./panel-provider";
import { usePlayer } from "./player-provider";

interface TrackMenuProps {
  item: Playable;
  label?: string;
  buttonClassName?: string;
}

interface MenuEntry {
  label: string;
  Icon: LucideIcon;
  iconClassName?: string;
  onSelect?: () => void;
}

const MENU_HEIGHT = 410;
const PLAYER_BAR_HEIGHT = 72;

/** The "..." button and its menu. Items with no mock behaviour just close it. */
export default function TrackMenu({
  item,
  label = "More",
  buttonClassName,
}: TrackMenuProps) {
  const router = useRouter();
  const { likedIds, toggleLike, addToQueue } = usePlayer();
  const { setCreditsOpen, copyLink, setExpanded } = usePanel();
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
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

  const onToggle = () => {
    const bottom = rootRef.current?.getBoundingClientRect().bottom ?? 0;
    setOpenUpward(
      bottom + MENU_HEIGHT > window.innerHeight - PLAYER_BAR_HEIGHT
    );
    setOpen((value) => !value);
  };

  const goTo = (text: string) => {
    setExpanded(false);
    router.push(searchHref(text));
  };

  const liked = likedIds.has(item.id);
  const artist = item.artists[0];
  const entries: MenuEntry[] = [
    { label: "Add to playlist", Icon: Plus },
    liked
      ? {
          label: "Remove from Liked Songs",
          Icon: CheckCircle2,
          iconClassName: "text-spotify-green",
          onSelect: () => toggleLike(item.id),
        }
      : {
          label: "Save to Liked Songs",
          Icon: PlusCircle,
          onSelect: () => toggleLike(item.id),
        },
    { label: "Add to queue", Icon: ListEnd, onSelect: () => addToQueue(item) },
    { label: "Exclude from your taste profile", Icon: Ban },
    { label: "Go to song radio", Icon: Radio },
    { label: "Go to artist", Icon: UserRound, onSelect: () => goTo(artist) },
    ...(item.albumTitle
      ? [
          {
            label: "Go to album",
            Icon: Disc3,
            onSelect: () => goTo(item.albumTitle as string),
          },
        ]
      : []),
    {
      label: "View credits",
      Icon: FileText,
      onSelect: () => setCreditsOpen(true),
    },
    { label: "Share", Icon: Share2, onSelect: () => copyLink(item.title) },
    { label: "Open in Desktop app", Icon: MonitorDown },
  ];

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={onToggle}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full text-spotify-subdued transition hover:scale-105 hover:text-white",
          buttonClassName
        )}
      >
        <MoreIcon />
      </button>
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute right-0 z-50 w-[250px] max-w-[calc(100vw-32px)] rounded bg-spotify-elevated p-1 text-left shadow-[0_16px_24px_rgba(0,0,0,0.3),0_6px_8px_rgba(0,0,0,0.2)]",
            openUpward ? "bottom-full mb-1" : "top-full mt-1"
          )}
        >
          {entries.map(({ label: entryLabel, Icon, iconClassName, onSelect }) => (
            <button
              key={entryLabel}
              type="button"
              role="menuitem"
              onClick={() => {
                onSelect?.();
                setOpen(false);
              }}
              className="flex h-10 w-full items-center gap-3 rounded-sm px-3 text-left text-sm text-white/90 hover:bg-white/10"
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 text-spotify-subdued",
                  iconClassName
                )}
              />
              <span className="truncate">{entryLabel}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
