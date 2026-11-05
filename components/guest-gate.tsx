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
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { coverColor } from "@/lib/cover";
import type { Playable } from "@/lib/mock-data";
import { loginHref } from "@/lib/session";
import CoverArt from "./cover-art";

interface LoginPrompt {
  title: string;
  text: string;
  /** Shows "Not now" and "Log in" buttons. */
  withActions?: boolean;
  /** Opens beside this element. Otherwise it opens under the Log in button. */
  anchor?: DOMRect;
}

interface GuestGateValue {
  /** The "Start listening" dialog, shown when a guest presses Play. */
  promptPlay: (item: Playable | undefined) => void;
  /** The blue popover, shown when a guest saves, likes or follows. */
  promptLogin: (prompt: LoginPrompt) => void;
}

const GuestGateContext = createContext<GuestGateValue | null>(null);

const POPOVER_WIDTH = 332;
const EDGE_MARGIN = 8;
const ANCHOR_GAP = 12;
const NAV_HEIGHT = 64;

export function GuestGateProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [playItem, setPlayItem] = useState<Playable | null>(null);
  const [playOpen, setPlayOpen] = useState(false);
  const [prompt, setPrompt] = useState<LoginPrompt | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const promptPlay = useCallback((item: Playable | undefined) => {
    setPrompt(null);
    setPlayItem(item ?? null);
    setPlayOpen(true);
  }, []);

  const promptLogin = useCallback((next: LoginPrompt) => setPrompt(next), []);

  useEffect(() => {
    if (!prompt) return;
    const dismiss = () => setPrompt(null);
    const onPointerDown = (event: PointerEvent) => {
      if (!popoverRef.current?.contains(event.target as Node)) dismiss();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    // Waits a tick so the click that opened it doesn't also close it.
    const timer = setTimeout(() => {
      document.addEventListener("pointerdown", onPointerDown);
      document.addEventListener("keydown", onKeyDown);
    });
    return () => {
      clearTimeout(timer);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [prompt]);

  const value = useMemo(
    () => ({ promptPlay, promptLogin }),
    [promptLogin, promptPlay]
  );

  const popoverStyle: React.CSSProperties | undefined = prompt?.anchor
    ? {
        left: Math.min(
          prompt.anchor.right + ANCHOR_GAP,
          window.innerWidth - POPOVER_WIDTH - EDGE_MARGIN
        ),
        top: prompt.anchor.top,
      }
    : { right: EDGE_MARGIN, top: NAV_HEIGHT + EDGE_MARGIN };

  const tint = playItem ? coverColor(playItem.coverSeed) : "#535353";

  return (
    <GuestGateContext.Provider value={value}>
      {children}

      {prompt && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label={prompt.title}
          className="fixed z-[60] rounded-lg bg-[#0c69d8] p-4 text-white shadow-[0_16px_24px_rgba(0,0,0,0.3)]"
          style={{
            ...popoverStyle,
            width: POPOVER_WIDTH,
            maxWidth: `calc(100vw - ${EDGE_MARGIN * 2}px)`,
          }}
        >
          <div className="text-base font-bold">{prompt.title}</div>
          <p className="mt-1 text-sm">{prompt.text}</p>
          {prompt.withActions && (
            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPrompt(null)}
                className="px-2 text-sm font-bold text-white/80 transition hover:text-white"
              >
                Not now
              </button>
              <Link
                href={loginHref(pathname)}
                className="flex h-8 items-center rounded-full bg-white px-4 text-sm font-bold text-black transition hover:scale-105"
              >
                Log in
              </Link>
            </div>
          )}
        </div>
      )}

      <Dialog.Root open={playOpen} onOpenChange={setPlayOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70" />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed left-1/2 top-1/2 z-50 flex max-h-[95vh] w-[calc(100vw-32px)] max-w-[810px] -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          >
            <div
              className="grid w-full items-center gap-10 overflow-y-auto rounded-lg p-8 text-center text-white md:grid-cols-[minmax(0,300px)_minmax(0,1fr)] md:p-14"
              style={{
                background: `linear-gradient(color-mix(in srgb, ${tint} 55%, #2a2a2a), #2a2a2a)`,
              }}
            >
              {playItem && (
                <CoverArt
                  seed={playItem.coverSeed}
                  className="hidden rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.5)] md:block"
                />
              )}
              <div className="flex flex-col items-center">
                <Dialog.Title className="text-[32px] font-bold leading-tight">
                  Start listening with a free Spotify account
                </Dialog.Title>
                <Link
                  href={loginHref(pathname, "signup")}
                  className="mt-6 flex h-12 items-center rounded-full bg-spotify-green px-8 text-base font-bold text-black transition hover:scale-105 hover:bg-spotify-green-hover"
                >
                  Sign up free
                </Link>
                <button
                  type="button"
                  className="mt-4 h-12 rounded-full border border-spotify-muted px-8 text-base font-bold text-white transition hover:scale-105 hover:border-white"
                >
                  Download app
                </button>
                <p className="mt-6 text-sm text-spotify-subdued">
                  Already have an account?{" "}
                  <Link
                    href={loginHref(pathname)}
                    className="font-bold text-white underline"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>
            <Dialog.Close className="mt-4 text-base font-bold text-spotify-subdued transition hover:scale-105 hover:text-white">
              Close
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </GuestGateContext.Provider>
  );
}

export function useGuestGate() {
  const value = useContext(GuestGateContext);
  if (!value) throw new Error("useGuestGate must be used inside GuestGateProvider");
  return value;
}
