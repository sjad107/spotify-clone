"use client";

import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Pencil, X } from "lucide-react";
import { useAuth } from "./auth-provider";
import UserAvatar from "./user-avatar";

const MAX_NAME_LENGTH = 30;

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * "Profile details". The name is saved to the mock session. A photo is only
 * shown for this session: it's never uploaded, and a reload drops it.
 */
export default function ProfileEditDialog({
  open,
  onOpenChange,
}: ProfileEditDialogProps) {
  const { user, rename, avatarUrl, setAvatarUrl } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [menuOpen, setMenuOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const trimmed = name.trim();

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (next) setName(user?.name ?? "");
        setMenuOpen(false);
        onOpenChange(next);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-32px)] max-w-[524px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-spotify-elevated p-6 text-white shadow-2xl"
        >
          <div className="mb-6 flex items-center justify-between">
            <Dialog.Title className="text-2xl font-bold">
              Profile details
            </Dialog.Title>
            <Dialog.Close
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-full text-spotify-subdued transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          <form
            className="grid items-center gap-4 sm:grid-cols-[180px_minmax(0,1fr)]"
            onSubmit={(event) => {
              event.preventDefault();
              if (!trimmed) return;
              rename(trimmed.slice(0, MAX_NAME_LENGTH));
              onOpenChange(false);
            }}
          >
            <div className="relative mx-auto h-[180px] w-[180px]">
              <UserAvatar className="h-full w-full shadow-[0_4px_60px_rgba(0,0,0,0.5)]" />
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((value) => !value)}
                className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-full bg-black/70 text-sm text-white opacity-0 transition-opacity hover:opacity-100 focus-visible:opacity-100 aria-expanded:opacity-100"
              >
                <Pencil className="h-10 w-10" />
                Choose photo
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute left-1/2 top-[calc(100%-24px)] z-10 w-40 -translate-x-1/2 rounded bg-[#3e3e3e] p-1 shadow-xl"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => fileRef.current?.click()}
                    className="flex h-10 w-full items-center rounded-sm px-3 text-left text-sm hover:bg-white/10"
                  >
                    Choose photo
                  </button>
                  {avatarUrl !== null && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setAvatarUrl(null);
                        setMenuOpen(false);
                      }}
                      className="flex h-10 w-full items-center rounded-sm px-3 text-left text-sm hover:bg-white/10"
                    >
                      Remove photo
                    </button>
                  )}
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) setAvatarUrl(URL.createObjectURL(file));
                  event.target.value = "";
                  setMenuOpen(false);
                }}
              />
            </div>

            <div className="flex flex-col gap-4">
              <label className="sr-only" htmlFor="display-name">
                Name
              </label>
              <input
                id="display-name"
                value={name}
                maxLength={MAX_NAME_LENGTH}
                placeholder="Add a display name"
                onChange={(event) => setName(event.target.value)}
                className="h-10 w-full rounded bg-white/10 px-3 text-sm text-white placeholder:text-spotify-subdued focus:bg-[#333] focus:outline-none focus:ring-1 focus:ring-white/50"
              />
              <button
                type="submit"
                disabled={!trimmed}
                className="ml-auto h-12 rounded-full bg-white px-8 text-base font-bold text-black transition hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                Save
              </button>
            </div>
          </form>

          <p className="mt-4 text-xs font-bold">
            Photos stay in this browser tab only and aren&apos;t uploaded
            anywhere. Your name is kept in this demo&apos;s session.
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
