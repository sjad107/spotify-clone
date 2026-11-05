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

type PanelView = "now-playing" | "queue";

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
}

const PanelContext = createContext<PanelValue | null>(null);

const TOAST_MS = 2500;

/** State for the right-hand panel, shared with the player bar. */
export function PanelProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<PanelView>("now-playing");
  const [collapsed, setCollapsedState] = useState(false);
  const [slide, setSlide] = useState<PanelValue["slide"]>(null);
  const [expanded, setExpanded] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [followedNames, setFollowedNames] = useState<ReadonlySet<string>>(
    () => new Set()
  );
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

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

  const toggleFollow = useCallback((name: string) => {
    setFollowedNames((names) => {
      const updated = new Set(names);
      if (!updated.delete(name)) updated.add(name);
      return updated;
    });
  }, []);

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
    }),
    [
      closeQueue,
      collapsed,
      copyLink,
      creditsOpen,
      expanded,
      followedNames,
      setCollapsed,
      slide,
      toast,
      toggleFollow,
      toggleNowPlaying,
      toggleQueue,
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
