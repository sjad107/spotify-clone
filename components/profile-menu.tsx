"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ME_ID } from "@/lib/mock-data";
import { useAuth } from "./auth-provider";
import UserAvatar from "./user-avatar";

const PLACEHOLDER_ITEMS = ["Account", "Settings"];

/** The avatar at the end of the navbar. */
export default function ProfileMenu() {
  const router = useRouter();
  const { user, logOut } = useAuth();
  const [open, setOpen] = useState(false);
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

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={user?.name ?? "Profile"}
        title={user?.name}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 transition hover:scale-105"
      >
        <div className="h-10 w-10">
        <UserAvatar  className="w-full h-full"/>
        </div>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-48 rounded bg-spotify-elevated p-1 shadow-[0_16px_24px_rgba(0,0,0,0.3),0_6px_8px_rgba(0,0,0,0.2)]"
        >
          <Link
            href={`/user/${ME_ID}`}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex h-10 w-full items-center rounded-sm px-3 text-left text-sm text-white/90 hover:bg-white/10"
          >
            Profile
          </Link>
          {PLACEHOLDER_ITEMS.map((item) => (
            <button
              key={item}
              type="button"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex h-10 w-full items-center rounded-sm px-3 text-left text-sm text-white/90 hover:bg-white/10"
            >
              {item}
            </button>
          ))}
          <hr className="my-1 border-white/10" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              logOut();
              router.push("/");
              router.refresh();
            }}
            className="flex h-10 w-full items-center rounded-sm px-3 text-left text-sm text-white/90 hover:bg-white/10"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
