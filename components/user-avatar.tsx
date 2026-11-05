"use client";

import { cn } from "@/lib/utils";
import { useAuth } from "./auth-provider";
import CoverArt from "./cover-art";

const DEFAULT_AVATAR = "/images/pfp.webp";

/** The logged-in user's picture: the default, a chosen photo, or none. */
export default function UserAvatar({ className }: { className?: string }) {
  const { avatarUrl } = useAuth();

  if (avatarUrl === null) {
    return (
      <CoverArt
        seed="me"
        shape="circle"
        variant="placeholder"
        className={className}
      />
    );
  }

  return (
    // A chosen photo is a local object URL, which next/image can't optimise.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatarUrl ?? DEFAULT_AVATAR}
      alt=""
      className={cn("aspect-square rounded-full object-cover", className)}
    />
  );
}
