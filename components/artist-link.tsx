"use client";

import Link from "next/link";
import { artistHrefByName } from "@/lib/mock-data";
import { usePanel } from "./panel-provider";

interface ArtistLinkProps {
  name: string;
  className?: string;
}

/**
 * An artist's name, linking to their page. Also closes the Expand view and
 * Credits dialog, which would otherwise cover the page it opens.
 */
export default function ArtistLink({ name, className }: ArtistLinkProps) {
  const { setExpanded, setCreditsOpen } = usePanel();

  return (
    <Link
      href={artistHrefByName(name)}
      onClick={() => {
        setExpanded(false);
        setCreditsOpen(false);
      }}
      className={className}
    >
      {name}
    </Link>
  );
}
