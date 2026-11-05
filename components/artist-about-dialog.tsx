"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import ArtistBackdrop from "./artist-backdrop";

interface ArtistAboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artistId: string;
  name: string;
  bio: string[];
  followers: number;
  monthlyListeners: number;
  rank: number | null;
}

export function RankBadge({ rank }: { rank: number }) {
  return (
    <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full bg-[#1877f2] text-white">
      <span className="text-2xl font-bold leading-none">#{rank}</span>
      <span className="text-xs leading-tight">in the world</span>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-white">
        {value.toLocaleString("en-US")}
      </div>
      <div className="text-sm text-spotify-subdued">{label}</div>
    </div>
  );
}

export default function ArtistAboutDialog({
  open,
  onOpenChange,
  artistId,
  name,
  bio,
  followers,
  monthlyListeners,
  rank,
}: ArtistAboutDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70" />
        <Dialog.Content
          aria-describedby={undefined}
          className="spotify-scrollbar fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[calc(100vw-32px)] max-w-[768px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-[#181818] text-white shadow-2xl"
        >
          <Dialog.Title className="sr-only">About {name}</Dialog.Title>
          <div className="relative flex justify-center bg-black">
            <ArtistBackdrop
              seed={artistId}
              align="center"
              className="aspect-square w-[min(56%,420px)]"
            />
            <Dialog.Close
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition hover:scale-105"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
          <div className="grid gap-6 p-8 md:grid-cols-[200px_minmax(0,1fr)]">
            <div className="flex flex-col gap-5">
              {rank !== null && <RankBadge rank={rank} />}
              <Stat value={followers} label="Followers" />
              <Stat value={monthlyListeners} label="Monthly Listeners" />
            </div>
            <div className="space-y-4 text-base leading-relaxed text-white/90">
              {bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
