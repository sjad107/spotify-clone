"use client";

import Link from "next/link";
import { albumHref } from "@/lib/format";
import { usePanel } from "./panel-provider";

interface SongLinkProps {
  title: string;
  /** Podcast episodes and audiobook chapters have no album, so stay as text. */
  albumId?: string;
  className?: string;
}

/**
 * A song's name, linking to the album it's on. Also closes the Expand view and
 * Credits dialog, which would otherwise cover the page it opens.
 */
export default function SongLink({ title, albumId, className }: SongLinkProps) {
  const { setExpanded, setCreditsOpen } = usePanel();

  if (!albumId) return <span className={className}>{title}</span>;

  return (
    <Link
      href={albumHref(albumId)}
      onClick={() => {
        setExpanded(false);
        setCreditsOpen(false);
      }}
      className={`hover:underline ${className ?? ""}`}
    >
      {title}
    </Link>
  );
}
