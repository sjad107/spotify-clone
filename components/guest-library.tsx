"use client";

import Link from "next/link";
import { Globe, Plus } from "lucide-react";
import { CollapseLibraryIcon, LibraryIcon, OpenLibraryIcon } from "./icons";
import { useCloneNotice } from "./clone-notice";
import { useGuestGate } from "./guest-gate";
import { usePanel } from "./panel-provider";

const LEGAL_LINKS = [
  "Legal",
  "Safety & Privacy Center",
  "Privacy Policy",
  "Cookie Settings",
  "About Ads",
  "Accessibility",
];

const CREATE_PROMPT = {
  title: "Create a playlist",
  text: "Log in to create and share playlists.",
  withActions: true,
};

function PromoCard({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action: React.ReactNode;
}) {
  return (
    <section className="rounded-lg bg-spotify-highlight px-4 py-4">
      <h3 className="text-base font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm text-white">{text}</p>
      <div className="mt-5">{action}</div>
    </section>
  );
}

const PILL_BUTTON =
  "inline-flex h-8 items-center rounded-full bg-white px-4 text-sm font-bold text-black transition hover:scale-105";

/** The left panel while logged out: prompts instead of a library. */
export default function GuestLibrary({ compact }: { compact: boolean }) {
  const { promptLogin } = useGuestGate();
  const { setLibraryCompact } = usePanel();
  const { showCloneNotice } = useCloneNotice();

  const onCreate = (event: React.MouseEvent<HTMLElement>) =>
    promptLogin({
      ...CREATE_PROMPT,
      anchor: event.currentTarget.getBoundingClientRect(),
    });

  if (compact) {
    return (
      <header className="flex flex-col items-center gap-2 px-4 pb-2 pt-4">
        <button
          type="button"
          aria-label="Open Your Library"
          title="Open Your Library"
          onClick={() => setLibraryCompact(false)}
          className="group/open flex h-10 w-10 items-center justify-center text-spotify-subdued transition hover:text-white"
        >
          <LibraryIcon className="group-hover/open:hidden group-focus-visible/open:hidden" />
          <OpenLibraryIcon className="hidden group-hover/open:block group-focus-visible/open:block" />
        </button>
        <button
          type="button"
          aria-label="Create"
          title="Create"
          onClick={onCreate}
          className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-spotify-highlight text-spotify-subdued transition hover:scale-105 hover:bg-spotify-elevated hover:text-white"
        >
          <Plus className="h-4 w-4" />
        </button>
      </header>
    );
  }

  return (
    <div className="group/library flex h-full flex-col">
      <header className="flex items-center justify-between px-4 pb-2 pt-3">
        <div className="flex min-w-0 items-center">
          <div className="w-0 shrink-0 overflow-hidden transition-[width] duration-200 focus-within:w-7 group-hover/library:w-7">
            <button
              type="button"
              aria-label="Collapse Your Library"
              title="Collapse Your Library"
              onClick={() => setLibraryCompact(true)}
              className="flex h-8 w-4 items-center text-spotify-subdued transition hover:scale-105 hover:text-white"
            >
              <CollapseLibraryIcon />
            </button>
          </div>
          <h2 className="truncate text-base font-bold">Your Library</h2>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="flex h-8 shrink-0 items-center gap-2 rounded-full bg-white/10 pl-2 pr-4 text-sm font-bold transition-colors hover:bg-white/20"
        >
          <Plus className="h-4 w-4 text-spotify-subdued" />
          Create
        </button>
      </header>

      <div className="spotify-scrollbar min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-5 px-2 pb-6 pt-3">
          <PromoCard
            title="Create your first playlist"
            text="It's easy, we'll help you"
            action={
              <button type="button" onClick={onCreate} className={PILL_BUTTON}>
                Create playlist
              </button>
            }
          />
          <PromoCard
            title="Let's find some podcasts to follow"
            text="We'll keep you updated on new episodes"
            action={
              <Link href="/search/Podcasts" className={PILL_BUTTON}>
                Browse podcasts
              </Link>
            }
          />
        </div>
      </div>

      <footer className="px-6 pb-6 pt-2">
        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-spotify-subdued">
          {LEGAL_LINKS.map((link) => (
            <li key={link}>
              <button
                type="button"
                onClick={() => showCloneNotice(link)}
                className="hover:underline"
              >
                {link}
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => showCloneNotice("Cookies")}
          className="mt-4 block text-xs text-white hover:underline"
        >
          Cookies
        </button>
        <button
          type="button"
          onClick={() => showCloneNotice("Language settings")}
          className="mt-6 flex h-8 items-center gap-1.5 rounded-full border border-spotify-muted px-3 text-sm font-bold text-white transition hover:scale-105 hover:border-white"
        >
          <Globe className="h-4 w-4" />
          English
        </button>
      </footer>
    </div>
  );
}
