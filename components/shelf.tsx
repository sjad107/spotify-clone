"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CardItem } from "@/lib/mock-data";
import MediaCard from "./media-card";

interface ShelfProps {
  title: string;
  items: CardItem[];
  /** Shown between the title and the cards. */
  headerExtra?: React.ReactNode;
}

const CARD_WIDTH = "w-[160px] shrink-0 md:w-[180px] 2xl:w-[195px]";

/**
 * A titled, horizontally scrolling row of cards. "Show all" expands it into a
 * wrapping grid in place, because there is no dedicated page to link to.
 */
export default function Shelf({ title, items, headerExtra }: ShelfProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    setCanScrollLeft(row.scrollLeft > 0);
    setCanScrollRight(row.scrollLeft + row.clientWidth < row.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    updateArrows();
    const observer = new ResizeObserver(updateArrows);
    observer.observe(row);
    return () => observer.disconnect();
  }, [expanded, items, updateArrows]);

  const scrollBy = (direction: 1 | -1) => {
    const row = rowRef.current;
    if (!row) return;
    row.scrollBy({ left: direction * row.clientWidth * 0.8, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <section className="-mx-3 mb-6">
      <div className="mb-1 flex items-end justify-between gap-4 px-3">
        <h2 className="truncate text-2xl font-bold">{title}</h2>
        {(canScrollLeft || canScrollRight || expanded) && (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="shrink-0 text-sm font-bold text-spotify-subdued hover:underline"
          >
            {expanded ? "Show less" : "Show all"}
          </button>
        )}
      </div>

      {headerExtra}

      {expanded ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
          {items.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="group/shelf relative">
          <div
            ref={rowRef}
            onScroll={updateArrows}
            className="no-scrollbar flex overflow-x-auto"
          >
            {items.map((item) => (
              <MediaCard key={item.id} item={item} className={CARD_WIDTH} />
            ))}
          </div>
          <ShelfArrow
            direction="left"
            visible={canScrollLeft}
            onClick={() => scrollBy(-1)}
          />
          <ShelfArrow
            direction="right"
            visible={canScrollRight}
            onClick={() => scrollBy(1)}
          />
        </div>
      )}
    </section>
  );
}

function ShelfArrow({
  direction,
  visible,
  onClick,
}: {
  direction: "left" | "right";
  visible: boolean;
  onClick: () => void;
}) {
  if (!visible) return null;
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={`Scroll ${direction}`}
      onClick={onClick}
      className={cn(
        "absolute top-[35%] z-20 flex h-8 w-8 items-center justify-center rounded-full bg-spotify-elevated text-white opacity-0 shadow-lg transition-opacity hover:scale-105 focus-visible:opacity-100 group-hover/shelf:opacity-100",
        direction === "left" ? "left-1" : "right-1"
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
