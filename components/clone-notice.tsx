"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";

export const REAL_SPOTIFY_URL = "https://open.spotify.com/";

type Notice = { kind: "feature"; feature?: string } | { kind: "login" };

interface CloneNoticeValue {
  /** Explains that a control isn't part of the clone. */
  showCloneNotice: (feature?: string) => void;
  /** The welcome shown on the login page. */
  showLoginNotice: () => void;
}

const CloneNoticeContext = createContext<CloneNoticeValue | null>(null);

export function useCloneNotice() {
  const value = useContext(CloneNoticeContext);
  if (!value) throw new Error("useCloneNotice needs a CloneNoticeProvider");
  return value;
}

/** Props for a button or link that only shows the notice. */
export function useCloneOnly(feature?: string) {
  const { showCloneNotice } = useCloneNotice();
  return {
    onClick: (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      showCloneNotice(feature);
    },
  };
}

const COPY = {
  feature: {
    title: "This is just a clone",
    stay: "Got it",
  },
  login: {
    title: "Welcome to the Spotify clone",
    stay: "Continue to demo",
  },
};

export function CloneNoticeProvider({ children }: { children: React.ReactNode }) {
  const [notice, setNotice] = useState<Notice | null>(null);

  const showCloneNotice = useCallback(
    (feature?: string) => setNotice({ kind: "feature", feature }),
    []
  );
  const showLoginNotice = useCallback(() => setNotice({ kind: "login" }), []);
  const value = useMemo(
    () => ({ showCloneNotice, showLoginNotice }),
    [showCloneNotice, showLoginNotice]
  );

  // Keep the last notice while the dialog animates closed.
  const [shown, setShown] = useState<Notice>({ kind: "feature" });
  if (notice && notice !== shown) setShown(notice);
  const copy = COPY[shown.kind];

  return (
    <CloneNoticeContext.Provider value={value}>
      {children}
      <Dialog.Root
        open={notice !== null}
        onOpenChange={(open) => {
          if (!open) setNotice(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/70" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[70] w-[calc(100vw-32px)] max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-spotify-elevated p-8 text-center text-white shadow-[0_16px_24px_rgba(0,0,0,0.3),0_6px_8px_rgba(0,0,0,0.2)] focus:outline-none">
            <Image
              src="/images/Spotify_Primary_Logo_RGB_White.png"
              alt=""
              width={40}
              height={40}
              className="mx-auto"
            />
            <Dialog.Title className="mt-4 text-2xl font-bold leading-tight">
              {copy.title}
            </Dialog.Title>
            <Dialog.Description asChild>
              <div className="mt-3 space-y-2 text-sm text-spotify-subdued">
                {shown.kind === "login" ? (
                  <>
                    <p>
                      This is a personal UI project that copies Spotify&apos;s
                      web player. It isn&apos;t affiliated with Spotify.
                    </p>
                    <p>
                      Logging in here is a demo: any email and any 6-digit code
                      work, and nothing is sent anywhere. Please don&apos;t use
                      your real account details.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      {shown.feature ? (
                        <>
                          <span className="font-bold text-white">
                            {shown.feature}
                          </span>{" "}
                          isn&apos;t part of this clone.
                        </>
                      ) : (
                        "This button isn't part of this clone."
                      )}
                    </p>
                    <p>
                      It&apos;s a personal UI project with mock data, so some
                      buttons are only for show. For the real thing, open
                      Spotify.
                    </p>
                  </>
                )}
              </div>
            </Dialog.Description>
            <div className="mt-8 flex flex-col-reverse items-center justify-center gap-3 sm:flex-row">
              <Dialog.Close className="h-12 rounded-full px-6 text-base font-bold text-spotify-subdued transition hover:scale-105 hover:text-white">
                {copy.stay}
              </Dialog.Close>
              <a
                href={REAL_SPOTIFY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setNotice(null)}
                className="flex h-12 items-center rounded-full bg-spotify-green px-8 text-base font-bold text-black transition hover:scale-105 hover:bg-spotify-green-hover"
              >
                Open Spotify
              </a>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </CloneNoticeContext.Provider>
  );
}
