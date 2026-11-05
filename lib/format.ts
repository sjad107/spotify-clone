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

/** The total shown in a playlist header, like "18 min 42 sec" or "2 hr 5 min". */
export function formatTotalDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return hours > 0
    ? `${hours} hr ${minutes} min`
    : `${minutes} min ${totalSeconds % 60} sec`;
}

export const albumHref = (albumId: string) => `/album/${albumId}`;

/** Rounds a count the way artist headers show it, like "51M" or "480K". */
export function formatCompactCount(count: number): string {
  if (count >= 1_000_000) return `${Math.round(count / 1_000_000)}M`;
  if (count >= 1_000) return `${Math.round(count / 1_000)}K`;
  return String(count);
}

/** Names with no page of their own, like podcast publishers, link to search. */
export const searchHref = (text: string) =>
  `/search/${encodeURIComponent(text)}`;
