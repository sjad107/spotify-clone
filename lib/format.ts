/** Formats seconds as m:ss, or h:mm:ss for an hour or longer. */
export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = String(safe % 60).padStart(2, "0");
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${seconds}`
    : `${minutes}:${seconds}`;
}

/** There are no artist or album pages yet, so names link to their search. */
export const searchHref = (text: string) =>
  `/search/${encodeURIComponent(text)}`;
