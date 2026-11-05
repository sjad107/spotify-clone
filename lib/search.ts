import {
  albums,
  artists,
  artistById,
  categories,
  playlists,
  profiles,
  shows,
  trackArtistNames,
  trackGenre,
  tracks,
  type Album,
  type Artist,
  type Category,
  type Entity,
  type Playlist,
  type Profile,
  type Show,
  type Track,
} from "./mock-data";

export interface SearchResults {
  top: Entity | null;
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
  podcasts: Show[];
  audiobooks: Show[];
  profiles: Profile[];
  categories: Category[];
  /** Playlists containing the top result, when the top result is an artist. */
  featuring: { artist: Artist; playlists: Playlist[] } | null;
}

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

/**
 * Scores a candidate against the query. Every query word has to appear in the
 * name or the secondary fields, and name matches outrank secondary ones.
 * Returns 0 when the candidate doesn't match.
 */
function score(query: string, name: string, secondary: string[]): number {
  const normalizedName = normalize(name);
  const haystack = normalize([name, ...secondary].join(" "));
  if (!query.split(/\s+/).every((word) => haystack.includes(word))) return 0;

  if (normalizedName === query) return 100;
  if (normalizedName.startsWith(query)) return 70;
  if (normalizedName.split(/\s+/).some((word) => word.startsWith(query))) {
    return 50;
  }
  if (normalizedName.includes(query)) return 30;
  return 10;
}

function rank<T>(
  items: T[],
  fields: (item: T) => { name: string; secondary: string[] },
  query: string
) {
  return items
    .map((item) => {
      const { name, secondary } = fields(item);
      return { item, score: score(query, name, secondary) };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);
}

export function search(rawQuery: string): SearchResults {
  const query = normalize(rawQuery);

  const rankedArtists = rank(
    artists,
    (a) => ({ name: a.name, secondary: a.genres }),
    query
  );
  const rankedTracks = rank(
    tracks,
    (t) => ({
      name: t.title,
      secondary: [trackArtistNames(t), trackGenre(t)],
    }),
    query
  );
  const rankedAlbums = rank(
    albums,
    (a) => ({
      name: a.title,
      secondary: [artistById(a.artistId)?.name ?? "", a.genre],
    }),
    query
  );
  const rankedPlaylists = rank(
    playlists,
    (p) => ({ name: p.title, secondary: [p.description, ...p.tags] }),
    query
  );
  const rankedShows = rank(
    shows,
    (s) => ({ name: s.title, secondary: [s.publisher, ...s.tags] }),
    query
  );
  const rankedProfiles = rank(
    profiles,
    (p) => ({ name: p.name, secondary: [] }),
    query
  );
  const rankedCategories = rank(
    categories,
    (c) => ({ name: c.name, secondary: [] }),
    query
  );

  // Candidates are listed by type priority, and the sort below is stable, so
  // an artist beats a song with the same score.
  const candidates: { item: Entity; score: number }[] = [
    ...rankedArtists,
    ...rankedTracks,
    ...rankedAlbums,
    ...rankedPlaylists,
    ...rankedShows,
  ];
  const top = [...candidates].sort((a, b) => b.score - a.score)[0]?.item ?? null;

  let featuring: SearchResults["featuring"] = null;
  if (top?.type === "artist") {
    const artistTrackIds = new Set(
      tracks.filter((t) => t.artistIds.includes(top.id)).map((t) => t.id)
    );
    const containing = playlists.filter((p) =>
      p.trackIds.some((id) => artistTrackIds.has(id))
    );
    if (containing.length > 0) {
      featuring = { artist: top, playlists: containing };
    }
  }

  // When an artist is the top result, list that artist's songs first.
  const orderedTracks = rankedTracks
    .map((entry) => entry.item)
    .sort((a, b) => {
      if (top?.type !== "artist") return 0;
      return (
        Number(b.artistIds.includes(top.id)) -
        Number(a.artistIds.includes(top.id))
      );
    });

  const showItems = rankedShows.map((entry) => entry.item);

  return {
    top,
    tracks: orderedTracks,
    artists: rankedArtists.map((entry) => entry.item),
    albums: rankedAlbums.map((entry) => entry.item),
    playlists: rankedPlaylists.map((entry) => entry.item),
    podcasts: showItems.filter((s) => s.kind === "Podcast"),
    audiobooks: showItems.filter((s) => s.kind === "Audiobook"),
    profiles: rankedProfiles.map((entry) => entry.item),
    categories: rankedCategories.map((entry) => entry.item),
    featuring,
  };
}

export function hasResults(results: SearchResults): boolean {
  return (
    results.top !== null ||
    results.profiles.length > 0 ||
    results.categories.length > 0
  );
}
