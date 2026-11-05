"use client";

import { X } from "lucide-react";
import { usePanel } from "./panel-provider";
import { usePlayer } from "./player-provider";
import QueueRow from "./queue-row";

export default function QueueView() {
  const { current, upNext, sourceName, isPlaying, togglePlay, skipTo } =
    usePlayer();
  const { closeQueue } = usePanel();

  return (
    <div className="relative h-full">
      <header className="absolute inset-x-0 top-0 z-20 flex h-16 items-center justify-between bg-spotify-base px-4">
        <h1 className="text-base font-bold text-white">Queue</h1>
        <button
          type="button"
          aria-label="Close"
          onClick={closeQueue}
          className="flex h-8 w-8 items-center justify-center text-spotify-subdued transition hover:scale-105 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="panel-scrollbar h-full overflow-y-auto pb-4 pl-2 pr-0 pt-16">
        {current && (
          <section className="mt-5">
            <h2 className="mb-2 px-2 text-base font-bold text-white">
              Now playing
            </h2>
            <QueueRow
              item={current}
              active
              playing={isPlaying}
              onPlay={togglePlay}
            />
          </section>
        )}
        {upNext.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-2 truncate px-2 text-base font-bold text-white">
              Next from: {sourceName}
            </h2>
            <ul aria-label="Next up">
              {upNext.map((item, index) => (
                // The same song can be queued twice, so the id alone won't do.
                <li key={`${item.id}-${index}`}>
                  <QueueRow item={item} onPlay={() => skipTo(index)} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
