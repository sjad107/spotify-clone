"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { searchHref } from "@/lib/format";
import { libraryEntities } from "@/lib/mock-data";
import { useAuth } from "./auth-provider";
import { useGuestGate } from "./guest-gate";

type PanelView = "now-playing" | "queue";
export type TracklistView = "list" | "compact";
export type ResizeSource = "drag" | "keyboard";

export const LIBRARY_COMPACT_WIDTH = 72;
export const LIBRARY_MIN_WIDTH = 280;
export const LIBRARY_MAX_WIDTH = 420;
// A drag that ends below this collapses the library. Above it, the library
// stops at its minimum width. Measured to be between 170 and 202 on
// open.spotify.com; this is the midpoint of the compact and minimum widths.
const LIBRARY_SNAP_WIDTH = 176;

const clampLibraryWidth = (width: number) =>
  Math.min(LIBRARY_MAX_WIDTH, Math.max(LIBRARY_MIN_WIDTH, width));

interface PanelValue {
  view: PanelView;
  collapsed: boolean;
  /** Which way the panel last slid. Null until it has been toggled once. */
  slide: "open" | "close" | null;
  expanded: boolean;
  creditsOpen: boolean;
  toast: string | null;
  followedNames: ReadonlySet<string>;
  setCollapsed: (collapsed: boolean) => void;
  setExpanded: (expanded: boolean) => void;
  setCreditsOpen: (open: boolean) => void;
  /** The player bar's cover art button. */
  toggleNowPlaying: () => void;
  /** The player bar's queue button and the "Open queue" link. */
  toggleQueue: () => void;
  closeQueue: () => void;
  toggleFollow: (name: string) => void;
  copyLink: (title: string) => void;
  /** Null until resized, which leaves the width to the responsive defaults. */
  libraryWidth: number | null;
  libraryCompact: boolean;
  setLibraryCompact: (compact: boolean) => void;
  resizeLibrary: (candidate: number, source: ResizeSource) => void;
  tracklistView: TracklistView;
  setTracklistView: (view: TracklistView) => void;
}

const PanelContext = createContext<PanelValue | null>(null);

const TOAST_MS = 2500;

/** Layout state for the side panels and the tracklist view. */
export function PanelProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { promptLogin } = useGuestGate();
  const [view, setView] = useState<PanelView>("now-playing");
  // Guests start with the panel minimized, as there's nothing playing.
  const [collapsed, setCollapsedState] = useState(!user);
  const [slide, setSlide] = useState<PanelValue["slide"]>(null);
  const [expanded, setExpanded] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [followedNames, setFollowedNames] = useState<ReadonlySet<string>>(
    () =>
      new Set(
        user
          ? libraryEntities.flatMap((e) => (e.type === "artist" ? [e.name] : []))
          : []
      )
  );
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const [libraryWidth, setLibraryWidth] = useState<number | null>(null);
  const [libraryCompact, setLibraryCompact] = useState(false);
  const [tracklistView, setTracklistView] = useState<TracklistView>("list");

  const resizeLibrary = useCallback(
    (candidate: number, source: ResizeSource) => {
      const collapse =
        source === "drag"
          ? candidate < LIBRARY_SNAP_WIDTH
          : libraryCompact
            ? candidate <= LIBRARY_COMPACT_WIDTH
            : candidate < LIBRARY_MIN_WIDTH;
      setLibraryCompact(collapse);
      // Reaching the bar by resizing passes through the minimum width, so
      // that is what the Open button comes back to.
      setLibraryWidth(collapse ? LIBRARY_MIN_WIDTH : clampLibraryWidth(candidate));
    },
    [libraryCompact]
  );

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const setCollapsed = useCallback((next: boolean) => {
    setCollapsedState(next);
    setSlide(next ? "close" : "open");
  }, []);

  const toggleNowPlaying = useCallback(() => {
    if (!collapsed && view === "now-playing") {
      setCollapsed(true);
      return;
    }
    setView("now-playing");
    if (collapsed) setCollapsed(false);
  }, [collapsed, setCollapsed, view]);

  const toggleQueue = useCallback(() => {
    if (!collapsed && view === "queue") {
      setView("now-playing");
      return;
    }
    setView("queue");
    if (collapsed) setCollapsed(false);
  }, [collapsed, setCollapsed, view]);

  const closeQueue = useCallback(() => setView("now-playing"), []);

  const toggleFollow = useCallback(
    (name: string) => {
      if (!user) {
        promptLogin({
          title: "You’re logged out",
          text: "Log in to follow this artist.",
        });
        return;
      }
      setFollowedNames((names) => {
        const updated = new Set(names);
        if (!updated.delete(name)) updated.add(name);
        return updated;
      });
    },
    [promptLogin, user]
  );

  const copyLink = useCallback((title: string) => {
    const showToast = (message: string) => {
      setToast(message);
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), TOAST_MS);
    };
    navigator.clipboard
      .writeText(`${window.location.origin}${searchHref(title)}`)
      .then(() => showToast("Link copied to clipboard"))
      .catch(() => showToast("Couldn't copy the link"));
  }, []);

  const value = useMemo<PanelValue>(
    () => ({
      view,
      collapsed,
      slide,
      expanded,
      creditsOpen,
      toast,
      followedNames,
      setCollapsed,
      setExpanded,
      setCreditsOpen,
      toggleNowPlaying,
      toggleQueue,
      closeQueue,
      toggleFollow,
      copyLink,
      libraryWidth,
      libraryCompact,
      setLibraryCompact,
      resizeLibrary,
      tracklistView,
      setTracklistView,
    }),
    [
      closeQueue,
      collapsed,
      copyLink,
      creditsOpen,
      expanded,
      followedNames,
      libraryCompact,
      libraryWidth,
      resizeLibrary,
      setCollapsed,
      slide,
      toast,
      toggleFollow,
      toggleNowPlaying,
      toggleQueue,
      tracklistView,
      view,
    ]
  );

  return (
    <PanelContext.Provider value={value}>{children}</PanelContext.Provider>
  );
}

export function usePanel() {
  const value = useContext(PanelContext);
  if (!value) throw new Error("usePanel must be used inside PanelProvider");
  return value;
}
