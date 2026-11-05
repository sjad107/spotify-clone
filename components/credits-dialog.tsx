"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import CreditsList from "./credits-list";
import { usePanel } from "./panel-provider";
import { usePlayer } from "./player-provider";

export default function CreditsDialog() {
  const { current } = usePlayer();
  const { creditsOpen, setCreditsOpen } = usePanel();

  return (
    <Dialog.Root open={creditsOpen} onOpenChange={setCreditsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-50 max-h-[80vh] w-[calc(100vw-32px)] max-w-[540px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-spotify-elevated p-6 text-white shadow-2xl"
        >
          <div className="mb-4 flex items-center justify-between gap-4">
            <Dialog.Title className="text-2xl font-bold">Credits</Dialog.Title>
            <Dialog.Close
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-full text-spotify-subdued hover:text-white"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
          {current && (
            <>
              <p className="mb-3 truncate text-base font-bold">
                {current.title}
              </p>
              <CreditsList credits={current.credits} />
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
