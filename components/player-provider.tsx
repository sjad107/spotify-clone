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
import {
  initialLikedTrackIds,
  initialQueue,
  initialQueueSource,
  initialQueueSourceName,
  libraryEntities,
  type Playable,
} from "@/lib/mock-data";
import { useAuth } from "./auth-provider";
import { useGuestGate } from "./guest-gate";

type RepeatMode = "off" | "all" | "one";

interface PlayerValue {
  current: Playable | null;
  /** Everything after the current item, in the order it will play. */
  upNext: Playable[];
  /** The card or list the queue came from, so it can show a pause button. */
  sourceId: string | null;
  sourceName: string;
  isPlaying: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  volume: number;
  muted: boolean;
  likedIds: ReadonlySet<string>;
  /** Playlists and albums in the library, by card id like "album:portside". */
  savedCollectionIds: ReadonlySet<string>;
  toggleSavedCollection: (cardId: string) => void;
  play: (
    sourceId: string,
    items: Playable[],
    index: number,
    sourceName: string
  ) => void;
  toggleSource: (
    sourceId: string,
    items: Playable[],
    sourceName: string
  ) => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  /** Jumps to an item in upNext. */
  skipTo: (upNextIndex: number) => void;
  addToQueue: (item: Playable) => void;
  seek: (seconds: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleLike: (id: string) => void;
}

const PlayerContext = createContext<PlayerValue | null>(null);

// Progress changes every second. It has its own context so that only the
// player bar re-renders on each tick, not every card on the page.
const ProgressContext = createContext(0);

const RESTART_THRESHOLD_SEC = 3;

function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Simulated playback. There is no audio: progress is a one second timer that
 * advances through a mock queue.
 *
 * Shuffling reorders the queue itself, so Next in queue and the Queue view
 * always show what will really play next. The unshuffled order is kept so
 * that turning shuffle off can restore it.
 */
export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { promptPlay, promptLogin } = useGuestGate();
  const startingQueue = user ? initialQueue : [];
  const [queue, setQueue] = useState<Playable[]>(startingQueue);
  const unshuffledQueue = useRef<Playable[]>(startingQueue);
  const [index, setIndex] = useState(0);
  const [sourceId, setSourceId] = useState<string | null>(
    user ? initialQueueSource : null
  );
  const [sourceName, setSourceName] = useState(user ? initialQueueSourceName : "");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(42);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("off");
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [likedIds, setLikedIds] = useState<ReadonlySet<string>>(
    () => new Set(user ? initialLikedTrackIds : [])
  );

  const [savedCollectionIds, setSavedCollectionIds] = useState<
    ReadonlySet<string>
  >(
    () =>
      new Set(
        user
          ? libraryEntities
              .filter((e) => e.type === "playlist" || e.type === "album")
              .map((e) => `${e.type}:${e.id}`)
          : []
      )
  );

  const current = queue[index] ?? null;
  const upNext = useMemo(() => queue.slice(index + 1), [queue, index]);

  const play = useCallback(
    (
      nextSource: string,
      items: Playable[],
      startIndex: number,
      nextSourceName: string
    ) => {
      if (items.length === 0) return;
      if (!user) {
        promptPlay(items[startIndex]);
        return;
      }
      unshuffledQueue.current = items;
      if (shuffle) {
        const rest = items.filter((_, i) => i !== startIndex);
        setQueue([items[startIndex], ...shuffled(rest)]);
        setIndex(0);
      } else {
        setQueue(items);
        setIndex(startIndex);
      }
      setSourceId(nextSource);
      setSourceName(nextSourceName);
      setProgress(0);
      setIsPlaying(true);
    },
    [promptPlay, shuffle, user]
  );

  const togglePlay = useCallback(() => setIsPlaying((value) => !value), []);

  const toggleSource = useCallback(
    (nextSource: string, items: Playable[], nextSourceName: string) => {
      if (nextSource === sourceId) {
        togglePlay();
      } else {
        play(nextSource, items, 0, nextSourceName);
      }
    },
    [play, sourceId, togglePlay]
  );

  const next = useCallback(() => {
    setProgress(0);
    if (index < queue.length - 1) {
      setIndex(index + 1);
      return;
    }
    setIndex(0);
    if (repeat === "off") setIsPlaying(false);
  }, [index, queue.length, repeat]);

  const previous = useCallback(() => {
    if (progress > RESTART_THRESHOLD_SEC || index === 0) {
      setProgress(0);
      return;
    }
    setIndex(index - 1);
    setProgress(0);
  }, [index, progress]);

  const skipTo = useCallback(
    (upNextIndex: number) => {
      setIndex(index + 1 + upNextIndex);
      setProgress(0);
      setIsPlaying(true);
    },
    [index]
  );

  const addToQueue = useCallback(
    (item: Playable) => {
      if (!user) {
        promptLogin({
          title: "You’re logged out",
          text: "Log in to add songs to your queue.",
        });
        return;
      }
      const insertAfterCurrent = (list: Playable[], position: number) => [
        ...list.slice(0, position + 1),
        item,
        ...list.slice(position + 1),
      ];
      setQueue((list) => insertAfterCurrent(list, index));
      const original = unshuffledQueue.current;
      unshuffledQueue.current = insertAfterCurrent(
        original,
        original.findIndex((entry) => entry.id === current?.id)
      );
    },
    [current?.id, index, promptLogin, user]
  );

  const toggleShuffle = useCallback(() => {
    if (shuffle) {
      const original = unshuffledQueue.current;
      setQueue(original);
      setIndex(Math.max(0, original.findIndex((e) => e.id === current?.id)));
    } else {
      setQueue([
        ...queue.slice(0, index + 1),
        ...shuffled(queue.slice(index + 1)),
      ]);
    }
    setShuffle(!shuffle);
  }, [current?.id, index, queue, shuffle]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => setProgress((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    if (!current || progress < current.durationSec) return;
    if (repeat === "one") {
      setProgress(0);
    } else {
      next();
    }
  }, [current, next, progress, repeat]);

  const value = useMemo<PlayerValue>(
    () => ({
      current,
      upNext,
      sourceId,
      sourceName,
      isPlaying,
      shuffle,
      repeat,
      volume,
      muted,
      likedIds,
      savedCollectionIds,
      toggleSavedCollection: (cardId) => {
        if (!user) {
          const kind = cardId.startsWith("album:") ? "album" : "playlist";
          promptLogin({
            title: "You’re logged out",
            text: `Log in to save this ${kind} to Your Library.`,
          });
          return;
        }
        setSavedCollectionIds((previousIds) => {
          const updated = new Set(previousIds);
          if (!updated.delete(cardId)) updated.add(cardId);
          return updated;
        });
      },
      play,
      toggleSource,
      togglePlay,
      next,
      previous,
      skipTo,
      addToQueue,
      seek: setProgress,
      toggleShuffle,
      cycleRepeat: () =>
        setRepeat((mode) =>
          mode === "off" ? "all" : mode === "all" ? "one" : "off"
        ),
      setVolume: (level) => {
        setVolume(level);
        setMuted(false);
      },
      toggleMute: () => setMuted((on) => !on),
      toggleLike: (id) => {
        if (!user) {
          promptLogin({
            title: "You’re logged out",
            text: "Log in to save this song to your Liked Songs.",
          });
          return;
        }
        setLikedIds((previousIds) => {
          const updated = new Set(previousIds);
          if (!updated.delete(id)) updated.add(id);
          return updated;
        });
      },
    }),
    [
      addToQueue,
      current,
      isPlaying,
      likedIds,
      muted,
      next,
      play,
      previous,
      promptLogin,
      repeat,
      savedCollectionIds,
      shuffle,
      skipTo,
      sourceId,
      sourceName,
      toggleShuffle,
      toggleSource,
      togglePlay,
      upNext,
      user,
      volume,
    ]
  );

  return (
    <PlayerContext.Provider value={value}>
      <ProgressContext.Provider value={progress}>
        {children}
      </ProgressContext.Provider>
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const value = useContext(PlayerContext);
  if (!value) throw new Error("usePlayer must be used inside PlayerProvider");
  return value;
}

export const usePlayerProgress = () => useContext(ProgressContext);
