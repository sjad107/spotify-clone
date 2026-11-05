/**
 * All content in the app comes from this file. Every artist, album, track,
 * playlist, show, profile and credit below is invented.
 */

import { hashSeed } from "./cover";

export interface Artist {
  type: "artist";
  id: string;
  name: string;
  genres: string[];
}

export interface Album {
  type: "album";
  id: string;
  title: string;
  artistId: string;
  year: number;
  kind: "Album" | "Single" | "EP";
  genre: string;
}

export interface Track {
  type: "track";
  id: string;
  title: string;
  artistIds: string[];
  albumId: string;
  durationSec: number;
  explicit: boolean;
}

export interface Playlist {
  type: "playlist";
  id: string;
  title: string;
  description: string;
  owner: string;
  tags: string[];
  trackIds: string[];
}

export interface Show {
  type: "show";
  id: string;
  kind: "Podcast" | "Audiobook";
  title: string;
  publisher: string;
  tags: string[];
}

export interface Profile {
  type: "profile";
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export type Entity = Artist | Album | Track | Playlist | Show | Profile;

export interface Credit {
  name: string;
  roles: string[];
  /** Artists get a link and a Follow button. Writers and producers don't. */
  isArtist: boolean;
}

/** Anything the player can hold in its queue. */
export interface Playable {
  id: string;
  title: string;
  subtitle: string;
  artists: string[];
  albumTitle?: string;
  coverSeed: string;
  durationSec: number;
  explicit: boolean;
  credits: Credit[];
}

/** The display shape shared by shelf cards and library rows. */
export interface CardItem {
  id: string;
  title: string;
  subtitle: string;
  coverSeed: string;
  shape: "square" | "circle";
  variant: "art" | "person";
  explicit: boolean;
  /** Printed on the artwork, like an editorial playlist cover. */
  label?: string;
  /** Shown in the Now Playing header while this item is the queue's source. */
  sourceName: string;
  playables: Playable[];
}

export const currentUser = { name: "Sajjad" };

const artist = (id: string, name: string, ...genres: string[]): Artist => ({
  type: "artist",
  id,
  name,
  genres,
});

export const artists: Artist[] = [
  artist("nova-reign", "Nova Reign", "Pop"),
  artist("paper-lanterns", "The Paper Lanterns", "Indie", "Rock"),
  artist("kairo-blaze", "Kairo Blaze", "Hip-Hop"),
  artist("midnight-arcade", "Midnight Arcade", "Dance/Electronic"),
  artist("ivy-marlowe", "Ivy Marlowe", "Pop", "R&B"),
  artist("static-bloom", "Static Bloom", "Rock"),
  artist("lumen-kid", "Lumen Kid", "Dance/Electronic", "Pop"),
  artist("sol-rivera", "Sol Rivera", "Latin"),
  artist("ash-and-ember", "Ash & Ember", "Folk & Acoustic", "Indie"),
  artist("juno-vale", "Juno Vale", "R&B"),
  artist("iron-tides", "Iron Tides", "Rock", "Metal"),
  artist("velvet-static", "Velvet Static", "Indie"),
  artist("mc-halcyon", "MC Halcyon", "Hip-Hop"),
  artist("aurora-keys", "Aurora Keys", "Classical"),
  artist("dune-collective", "Dune Collective", "Jazz"),
  artist("neon-harbor", "Neon Harbor", "Dance/Electronic"),
];

const album = (
  id: string,
  title: string,
  artistId: string,
  year: number,
  kind: Album["kind"],
  genre: string
): Album => ({ type: "album", id, title, artistId, year, kind, genre });

export const albums: Album[] = [
  album("glass-horizons", "Glass Horizons", "nova-reign", 2026, "Album", "Pop"),
  album("satellite-hearts", "Satellite Hearts", "nova-reign", 2024, "EP", "Pop"),
  album("slow-parade", "Slow Parade", "paper-lanterns", 2025, "Album", "Indie"),
  album("concrete-crown", "Concrete Crown", "kairo-blaze", 2026, "Album", "Hip-Hop"),
  album("last-train-east", "Last Train East", "kairo-blaze", 2023, "Single", "Hip-Hop"),
  album("high-score", "High Score", "midnight-arcade", 2025, "Album", "Dance/Electronic"),
  album("honey-and-smoke", "Honey & Smoke", "ivy-marlowe", 2026, "Album", "R&B"),
  album("feedback-garden", "Feedback Garden", "static-bloom", 2024, "Album", "Rock"),
  album("afterglow-theory", "Afterglow Theory", "lumen-kid", 2026, "EP", "Dance/Electronic"),
  album("calle-dorada", "Calle Dorada", "sol-rivera", 2025, "Album", "Latin"),
  album("hollow-pines", "Hollow Pines", "ash-and-ember", 2023, "Album", "Folk & Acoustic"),
  album("quiet-hours", "Quiet Hours", "juno-vale", 2026, "Single", "R&B"),
  album("undertow", "Undertow", "iron-tides", 2024, "Album", "Metal"),
  album("soft-focus", "Soft Focus", "velvet-static", 2025, "EP", "Indie"),
  album("sidewalk-psalms", "Sidewalk Psalms", "mc-halcyon", 2025, "Album", "Hip-Hop"),
  album("winter-sonatas", "Winter Sonatas", "aurora-keys", 2022, "Album", "Classical"),
  album("blue-mirage", "Blue Mirage", "dune-collective", 2024, "Album", "Jazz"),
  album("portside", "Portside", "neon-harbor", 2026, "Single", "Dance/Electronic"),
];

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const track = (
  title: string,
  albumId: string,
  duration: string,
  options: { explicit?: boolean; feat?: string[] } = {}
): Track => {
  const owner = albums.find((a) => a.id === albumId);
  if (!owner) throw new Error(`Unknown album: ${albumId}`);
  const [minutes, seconds] = duration.split(":").map(Number);
  return {
    type: "track",
    id: slug(title),
    title,
    artistIds: [owner.artistId, ...(options.feat ?? [])],
    albumId,
    durationSec: minutes * 60 + seconds,
    explicit: options.explicit ?? false,
  };
};

export const tracks: Track[] = [
  track("Glass Horizons", "glass-horizons", "3:24"),
  track("Paper Planes at Dawn", "glass-horizons", "2:58"),
  track("Golden Static", "glass-horizons", "3:41", { feat: ["lumen-kid"] }),
  track("Call Me Tomorrow", "glass-horizons", "3:12"),
  track("Satellite Hearts", "satellite-hearts", "3:05"),
  track("Orbit", "satellite-hearts", "2:47"),
  track("Slow Parade", "slow-parade", "4:12"),
  track("Lantern Season", "slow-parade", "3:36"),
  track("Everything Is a River", "slow-parade", "5:01"),
  track("Concrete Crown", "concrete-crown", "2:53", { explicit: true }),
  track("No Ceiling", "concrete-crown", "3:17", {
    explicit: true,
    feat: ["mc-halcyon"],
  }),
  track("Ghost Money", "concrete-crown", "2:41", { explicit: true }),
  track("Last Train East", "last-train-east", "3:09", { explicit: true }),
  track("High Score", "high-score", "4:44"),
  track("Insert Coin", "high-score", "3:58"),
  track("Player Two", "high-score", "5:12", { feat: ["neon-harbor"] }),
  track("Honey & Smoke", "honey-and-smoke", "3:33"),
  track("Slow Burn Sunday", "honey-and-smoke", "4:02", { feat: ["juno-vale"] }),
  track("Tell Me Twice", "honey-and-smoke", "3:18"),
  track("Feedback Garden", "feedback-garden", "4:27"),
  track("Rust & Roses", "feedback-garden", "3:49", { explicit: true }),
  track("Amplifier Saints", "feedback-garden", "3:02"),
  track("Afterglow Theory", "afterglow-theory", "3:55"),
  track("Prism Runner", "afterglow-theory", "4:18"),
  track("Calle Dorada", "calle-dorada", "3:21"),
  track("Fuego Lento", "calle-dorada", "2:59"),
  track("Medianoche", "calle-dorada", "3:37", { explicit: true }),
  track("Hollow Pines", "hollow-pines", "4:06"),
  track("Woodsmoke", "hollow-pines", "3:28"),
  track("Quiet Hours", "quiet-hours", "3:44"),
  track("Undertow", "undertow", "5:39", { explicit: true }),
  track("Black Water Hymn", "undertow", "6:02"),
  track("Soft Focus", "soft-focus", "3:15"),
  track("Polaroid Summer", "soft-focus", "2:52"),
  track("Sidewalk Psalms", "sidewalk-psalms", "3:26", { explicit: true }),
  track("Corner Store Prophet", "sidewalk-psalms", "2:48", { explicit: true }),
  track("Sonata for First Snow", "winter-sonatas", "6:47"),
  track("Nocturne in Grey", "winter-sonatas", "5:21"),
  track("Blue Mirage", "blue-mirage", "7:13"),
  track("Late Set at the Oasis", "blue-mirage", "6:08"),
  track("Portside", "portside", "3:30"),
];

export const artistById = (id: string) => artists.find((a) => a.id === id);
export const albumById = (id: string) => albums.find((a) => a.id === id);
export const trackById = (id: string) => tracks.find((t) => t.id === id);

export const trackArtistNames = (t: Track) =>
  t.artistIds.map((id) => artistById(id)?.name ?? "").join(", ");

export const trackGenre = (t: Track) => albumById(t.albumId)?.genre ?? "";

const ids = (...titles: string[]) => titles.map(slug);

const tracksInGenres = (...genres: string[]) =>
  tracks.filter((t) => genres.includes(trackGenre(t))).map((t) => t.id);

const playlist = (
  id: string,
  title: string,
  description: string,
  tags: string[],
  trackIds: string[],
  owner = "Spotify"
): Playlist => ({ type: "playlist", id, title, description, owner, tags, trackIds });

export const playlists: Playlist[] = [
  playlist("daily-mix-1", "Daily Mix 1", "Nova Reign, Ivy Marlowe, Lumen Kid and more", ["Made For You", "Music"], ids("Glass Horizons", "Honey & Smoke", "Afterglow Theory", "Orbit", "Tell Me Twice")),
  playlist("daily-mix-2", "Daily Mix 2", "Kairo Blaze, MC Halcyon and more", ["Made For You", "Music"], tracksInGenres("Hip-Hop")),
  playlist("daily-mix-3", "Daily Mix 3", "The Paper Lanterns, Velvet Static, Ash & Ember and more", ["Made For You", "Music"], tracksInGenres("Indie", "Folk & Acoustic")),
  playlist("discover-weekly", "Discover Weekly", "Your weekly mixtape of fresh music. Enjoy new music and deep cuts picked for you.", ["Made For You", "Music"], ids("Prism Runner", "Lantern Season", "Medianoche", "Woodsmoke", "Blue Mirage")),
  playlist("release-radar", "Release Radar", "Catch all the latest music from artists you follow.", ["Made For You", "New Releases", "Music"], ids("Concrete Crown", "Portside", "Quiet Hours", "Honey & Smoke")),
  playlist("on-repeat", "On Repeat", "Songs you can't get enough of right now.", ["Made For You", "Music"], ids("Golden Static", "High Score", "Slow Parade", "No Ceiling")),
  playlist("top-50-global", "Top 50 - Global", "Your daily update of the most played tracks right now.", ["Charts", "Music"], ids("Glass Horizons", "Concrete Crown", "Honey & Smoke", "Calle Dorada", "Golden Static", "Portside")),
  playlist("viral-hits", "Viral 50", "The most viral tracks of the moment.", ["Charts", "Music"], ids("Orbit", "Fuego Lento", "Polaroid Summer", "Ghost Money")),
  playlist("new-music-friday", "New Music Friday", "New tracks from around the world, updated every Friday.", ["New Releases", "Music"], ids("Portside", "Quiet Hours", "Afterglow Theory", "Glass Horizons")),
  playlist("pop-rising", "Pop Rising", "The hottest rising voices in pop.", ["Pop", "Music"], tracksInGenres("Pop")),
  playlist("rap-frontier", "Rap Frontier", "Where the next wave of hip-hop starts.", ["Hip-Hop", "Music"], tracksInGenres("Hip-Hop")),
  playlist("rock-anthems", "Rock Anthems", "Big riffs and bigger choruses.", ["Rock", "Music"], tracksInGenres("Rock", "Metal")),
  playlist("electronic-pulse", "Electronic Pulse", "Club-ready cuts and late night synths.", ["Dance/Electronic", "Music"], tracksInGenres("Dance/Electronic")),
  playlist("indie-mix", "Indie Mix", "Hazy guitars and quiet revelations.", ["Indie", "Music"], tracksInGenres("Indie")),
  playlist("chill-hours", "Chill Hours", "Kick back and let the afternoon drift by.", ["Mood", "Music"], ids("Soft Focus", "Woodsmoke", "Slow Burn Sunday", "Nocturne in Grey")),
  playlist("focus-flow", "Focus Flow", "Instrumental calm to keep you in the zone.", ["Mood", "Music"], ids("Sonata for First Snow", "Nocturne in Grey", "Blue Mirage", "Late Set at the Oasis")),
  playlist("live-sessions", "Live Sessions", "Recorded on stage. Turn it up.", ["Live Events", "Music"], ids("Amplifier Saints", "Black Water Hymn", "Everything Is a River")),
  playlist("gym-mode", "Gym Mode", "My workout rotation.", ["Mood"], ids("No Ceiling", "Undertow", "Insert Coin", "Ghost Money"), currentUser.name),
  playlist("road-trip", "Road Trip", "Windows down, volume up.", [], ids("Paper Planes at Dawn", "Rust & Roses", "Lantern Season", "Fuego Lento"), currentUser.name),
];

const show = (
  id: string,
  kind: Show["kind"],
  title: string,
  publisher: string,
  ...tags: string[]
): Show => ({
  type: "show",
  id,
  kind,
  title,
  publisher,
  tags: [kind === "Podcast" ? "Podcasts" : "Audiobooks", ...tags],
});

export const shows: Show[] = [
  show("signal-noise", "Podcast", "Signal & Noise", "Harbor Audio", "Educational", "Documentary"),
  show("the-long-way-home", "Podcast", "The Long Way Home", "Wayfarer Studios", "Documentary"),
  show("laugh-track", "Podcast", "Laugh Track", "Open Mic Network", "Comedy"),
  show("deep-time", "Podcast", "Deep Time", "Curious Minds", "Educational"),
  show("cold-open", "Podcast", "Cold Open", "Open Mic Network", "Comedy"),
  show("the-daily-brief", "Podcast", "The Daily Brief", "Morning Desk", "Educational"),
  show("verdict", "Podcast", "Verdict: True Crime Files", "Wayfarer Studios", "Documentary"),
  show("the-lighthouse-keeper", "Audiobook", "The Lighthouse Keeper", "Marian Oake"),
  show("atlas-of-small-things", "Audiobook", "An Atlas of Small Things", "Teo Brandt"),
  show("the-ninth-orchard", "Audiobook", "The Ninth Orchard", "Lena Harrow"),
];

export const profiles: Profile[] = [
  { type: "profile", id: "profile-sam", name: "Sam Okafor" },
  { type: "profile", id: "profile-rue", name: "Rue Tanaka" },
  { type: "profile", id: "profile-mel", name: "Mel Dupont" },
];

export const categories: Category[] = [
  { id: "music", name: "Music", color: "#dc148c" },
  { id: "podcasts", name: "Podcasts", color: "#006450" },
  { id: "audiobooks", name: "Audiobooks", color: "#2d46b9" },
  { id: "live-events", name: "Live Events", color: "#8400e7" },
  { id: "made-for-you", name: "Made For You", color: "#1e3264" },
  { id: "new-releases", name: "New Releases", color: "#608108" },
  { id: "pop", name: "Pop", color: "#477d95" },
  { id: "hip-hop", name: "Hip-Hop", color: "#477d95" },
  { id: "rock", name: "Rock", color: "#006450" },
  { id: "dance-electronic", name: "Dance/Electronic", color: "#477d95" },
  { id: "charts", name: "Charts", color: "#8d67ab" },
  { id: "educational", name: "Educational", color: "#477d95" },
  { id: "documentary", name: "Documentary", color: "#503750" },
  { id: "comedy", name: "Comedy", color: "#af2896" },
  { id: "mood", name: "Mood", color: "#e8115b" },
  { id: "indie", name: "Indie", color: "#e91429" },
  { id: "rnb", name: "R&B", color: "#ba5d07" },
  { id: "latin", name: "Latin", color: "#e1118c" },
  { id: "jazz", name: "Jazz", color: "#7358ff" },
  { id: "classical", name: "Classical", color: "#7d4b32" },
  { id: "folk-acoustic", name: "Folk & Acoustic", color: "#bc5900" },
  { id: "metal", name: "Metal", color: "#777777" },
];

export const initialLikedTrackIds = ids(
  "Golden Static",
  "Slow Parade",
  "High Score",
  "Honey & Smoke",
  "No Ceiling",
  "Calle Dorada"
);

const SONGWRITERS = [
  "Ren Castellano",
  "Mika Oduya",
  "Tomas Lind",
  "Priya Anand",
  "Elias Voss",
  "June Okoro",
];

const SONGWRITER_ROLES = [
  ["Composer", "Lyricist"],
  ["Producer"],
  ["Composer", "Arranger"],
  ["Lyricist"],
  ["Producer", "Mixing Engineer"],
];

function trackCredits(t: Track): Credit[] {
  const artistCredits = t.artistIds.map((id, index) => ({
    name: artistById(id)?.name ?? "",
    roles: [index === 0 ? "Main Artist" : "Featured Artist"],
    isArtist: true,
  }));
  const hash = hashSeed(t.id);
  const writerCredits = [0, 1].map((offset) => ({
    name: SONGWRITERS[(hash + offset) % SONGWRITERS.length],
    roles: SONGWRITER_ROLES[(hash + offset) % SONGWRITER_ROLES.length],
    isArtist: false,
  }));
  return [...artistCredits, ...writerCredits];
}

const trackToPlayable = (t: Track): Playable => ({
  id: t.id,
  title: t.title,
  subtitle: trackArtistNames(t),
  artists: t.artistIds.map((id) => artistById(id)?.name ?? ""),
  albumTitle: albumById(t.albumId)?.title,
  coverSeed: t.albumId,
  durationSec: t.durationSec,
  explicit: t.explicit,
  credits: trackCredits(t),
});

export const tracksToPlayables = (list: Track[]) => list.map(trackToPlayable);

export const playablesFromTrackIds = (trackIds: string[]) =>
  tracksToPlayables(
    trackIds.map(trackById).filter((t): t is Track => t !== undefined)
  );

function playablesFor(entity: Entity): Playable[] {
  switch (entity.type) {
    case "track":
      return [trackToPlayable(entity)];
    case "album":
      return tracksToPlayables(tracks.filter((t) => t.albumId === entity.id));
    case "artist":
      return tracksToPlayables(
        tracks.filter((t) => t.artistIds.includes(entity.id))
      );
    case "playlist":
      return playablesFromTrackIds(entity.trackIds);
    case "show":
      return [
        {
          id: `${entity.id}-latest`,
          title: entity.kind === "Podcast" ? "Latest episode" : "Chapter 1",
          subtitle: entity.title,
          artists: [entity.publisher],
          coverSeed: entity.id,
          durationSec: entity.kind === "Podcast" ? 2640 : 1820,
          explicit: false,
          credits: [
            {
              name: entity.publisher,
              roles: [entity.kind === "Podcast" ? "Publisher" : "Author"],
              isArtist: true,
            },
          ],
        },
      ];
    case "profile":
      return [];
  }
}

export function toCard(
  entity: Entity,
  options: { playlistSubtitle?: "description" | "owner" } = {}
): CardItem {
  const sourceName =
    entity.type === "track"
      ? (albumById(entity.albumId)?.title ?? entity.title)
      : "title" in entity
        ? entity.title
        : entity.name;
  const base = {
    explicit: false,
    shape: "square",
    variant: "art",
    sourceName,
  } as const;
  const playables = playablesFor(entity);
  switch (entity.type) {
    case "track":
      return {
        ...base,
        id: `${entity.type}:${entity.id}`,
        title: entity.title,
        subtitle: trackArtistNames(entity),
        coverSeed: entity.albumId,
        explicit: entity.explicit,
        playables,
      };
    case "album":
      return {
        ...base,
        id: `${entity.type}:${entity.id}`,
        title: entity.title,
        subtitle: artistById(entity.artistId)?.name ?? "",
        coverSeed: entity.id,
        playables,
      };
    case "artist":
      return {
        ...base,
        id: `${entity.type}:${entity.id}`,
        title: entity.name,
        subtitle: "Artist",
        coverSeed: entity.id,
        shape: "circle",
        variant: "person",
        playables,
      };
    case "playlist":
      return {
        ...base,
        id: `${entity.type}:${entity.id}`,
        title: entity.title,
        subtitle:
          options.playlistSubtitle === "owner"
            ? `By ${entity.owner}`
            : entity.description,
        coverSeed: entity.id,
        label: entity.owner === "Spotify" ? entity.title : undefined,
        playables,
      };
    case "show":
      return {
        ...base,
        id: `${entity.type}:${entity.id}`,
        title: entity.title,
        subtitle: entity.publisher,
        coverSeed: entity.id,
        playables,
      };
    case "profile":
      return {
        ...base,
        id: `${entity.type}:${entity.id}`,
        title: entity.name,
        subtitle: "Profile",
        coverSeed: entity.id,
        shape: "circle",
        variant: "person",
        playables,
      };
  }
}

const pickPlaylists = (...idList: string[]) =>
  idList.map((id) => playlists.find((p) => p.id === id)!);

const pickAlbums = (...idList: string[]) =>
  idList.map((id) => albums.find((a) => a.id === id)!);

const podcasts = shows.filter((s) => s.kind === "Podcast");

export interface HomeShelf {
  id: string;
  title: string;
  kind: "music" | "podcasts";
  items: CardItem[];
}

const cards = (entities: Entity[]) => entities.map((e) => toCard(e));

export const homeQuickAccess = {
  music: cards([
    ...pickPlaylists("daily-mix-1", "discover-weekly", "on-repeat", "gym-mode", "release-radar"),
    ...pickAlbums("glass-horizons", "concrete-crown", "high-score"),
  ]),
  podcasts: cards(podcasts.slice(0, 6)),
};

export const homeShelves: HomeShelf[] = [
  {
    id: "made-for-you",
    title: `Made For ${currentUser.name}`,
    kind: "music",
    items: cards(
      pickPlaylists("daily-mix-1", "daily-mix-2", "daily-mix-3", "discover-weekly", "release-radar", "on-repeat")
    ),
  },
  {
    id: "trending-songs",
    title: "Trending songs",
    kind: "music",
    items: cards(
      ids("Concrete Crown", "Glass Horizons", "Honey & Smoke", "Portside", "Fuego Lento", "Rust & Roses", "Polaroid Summer", "Ghost Money", "Prism Runner")
        .map(trackById)
        .filter((t): t is Track => t !== undefined)
    ),
  },
  {
    id: "popular-artists",
    title: "Popular artists",
    kind: "music",
    items: cards(artists.slice(0, 10)),
  },
  {
    id: "popular-albums",
    title: "Popular albums and singles",
    kind: "music",
    items: cards(
      pickAlbums("honey-and-smoke", "slow-parade", "feedback-garden", "calle-dorada", "sidewalk-psalms", "afterglow-theory", "undertow", "blue-mirage", "soft-focus")
    ),
  },
  {
    id: "popular-shows",
    title: "Episodes for you",
    kind: "podcasts",
    items: cards(podcasts),
  },
  {
    id: "featured-charts",
    title: "Featured Charts",
    kind: "music",
    items: cards(
      pickPlaylists("top-50-global", "viral-hits", "new-music-friday", "pop-rising", "rap-frontier", "rock-anthems", "electronic-pulse")
    ),
  },
  {
    id: "audiobooks",
    title: "Audiobooks for you",
    kind: "podcasts",
    items: cards(shows.filter((s) => s.kind === "Audiobook")),
  },
];

export const libraryEntities: Entity[] = [
  ...pickPlaylists("gym-mode", "road-trip", "discover-weekly", "daily-mix-1", "chill-hours", "focus-flow", "top-50-global"),
  ...pickAlbums("glass-horizons", "slow-parade", "blue-mirage"),
  artists[2],
  artists[4],
  artists[7],
  podcasts[0],
  podcasts[2],
];

/** A sensible first queue, so the player bar has something to show on load. */
export const initialQueue = playablesFromTrackIds(
  pickPlaylists("on-repeat")[0].trackIds
);
export const initialQueueSource = "playlist:on-repeat";
export const initialQueueSourceName = "On Repeat";
