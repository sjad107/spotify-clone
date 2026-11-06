"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Shuffle } from "lucide-react";
import { coverColor } from "@/lib/cover";
import { formatCompactCount } from "@/lib/format";
import {
  artistAlbums,
  artistAppearsOn,
  artistBio,
  artistById,
  artistDiscoveredOn,
  artistFansAlsoLike,
  artistPick,
  artistPopularTracks,
  artistStats,
  playlistsFeaturing,
  toCard,
  type Album,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import ArtistAboutDialog, { RankBadge } from "./artist-about-dialog";
import ArtistBackdrop from "./artist-backdrop";
import { useCloneNotice } from "./clone-notice";
import CollectionTrackRow from "./collection-track-row";
import { titleSizeClass } from "./collection-view";
import CoverArt from "./cover-art";
import FilterChips from "./filter-chips";
import { MoreIcon, VerifiedIcon } from "./icons";
import { usePanel } from "./panel-provider";
import PlayButton from "./play-button";
import { usePlayer } from "./player-provider";
import Shelf from "./shelf";
import SiteFooter from "./site-footer";
import StickyPlayBar, { useStickyBar } from "./sticky-play-bar";

const POPULAR_COLLAPSED_COUNT = 5;

const DISCOGRAPHY_FILTERS = [
  { id: "popular", label: "Popular releases", kinds: null },
  { id: "albums", label: "Albums", kinds: ["Album"] },
  { id: "singles", label: "Singles and EPs", kinds: ["Single", "EP"] },
  { id: "compilations", label: "Compilations", kinds: ["Compilation"] },
] as const;

type DiscographyFilter = (typeof DISCOGRAPHY_FILTERS)[number]["id"];

const matchesFilter = (album: Album, filter: DiscographyFilter) => {
  const { kinds } = DISCOGRAPHY_FILTERS.find((f) => f.id === filter)!;
  return kinds === null || (kinds as readonly string[]).includes(album.kind);
};

export default function ArtistPage({ artistId }: { artistId: string }) {
  const { sourceId, isPlaying, toggleSource, shuffle, toggleShuffle } =
    usePlayer();
  const { followedNames, toggleFollow } = usePanel();
  const { showCloneNotice } = useCloneNotice();
  const { sentinelRef, isStuck } = useStickyBar();
  const [showAllPopular, setShowAllPopular] = useState(false);
  const [discography, setDiscography] = useState<DiscographyFilter>("popular");
  const [aboutOpen, setAboutOpen] = useState(false);

  const artist = artistById(artistId);
  const popular = useMemo(() => artistPopularTracks(artistId), [artistId]);
  const releases = useMemo(() => artistAlbums(artistId), [artistId]);
  const shelves = useMemo(
    () => ({
      featuring: playlistsFeaturing(artistId).map((p) => toCard(p)),
      fans: artistFansAlsoLike(artistId).map((a) => toCard(a)),
      discovered: artistDiscoveredOn(artistId).map((p) => toCard(p)),
      appearsOn: artistAppearsOn(artistId).map((a) => ({
        ...toCard(a),
        subtitle: `${a.year} • ${a.kind}`,
      })),
    }),
    [artistId]
  );

  const releaseCards = useMemo(
    () =>
      releases
        .filter((album) => matchesFilter(album, discography))
        .map((album) => ({
          ...toCard(album),
          subtitle: `${
            album === releases[0] ? "Latest Release" : album.year
          } • ${album.kind}`,
        })),
    [discography, releases]
  );

  // The route checks the id before rendering this.
  if (!artist) return null;

  const card = toCard(artist);
  const tint = coverColor(artist.id);
  const stats = artistStats(artist);
  const bio = artistBio(artist);
  const pick = artistPick(artist.id);
  const following = followedNames.has(artist.name);
  const playingThis = sourceId === card.id && isPlaying;
  const onPlay = () => toggleSource(card.id, card.playables, artist.name);
  const visiblePopular = showAllPopular
    ? popular
    : popular.slice(0, POPULAR_COLLAPSED_COUNT);
  const availableFilters = DISCOGRAPHY_FILTERS.filter((filter) =>
    releases.some((album) => matchesFilter(album, filter.id))
  );

  return (
    <div className="relative flex min-h-full flex-col">
      <StickyPlayBar
        visible={isStuck}
        title={artist.name}
        tint={tint}
        playing={playingThis}
        onPlay={onPlay}
      />

      <header className="relative flex flex-col justify-end overflow-hidden px-4 pb-5 [height:clamp(280px,40vh,500px)] md:px-6">
        <ArtistBackdrop seed={artist.id} className="absolute inset-0" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"
        />
        <div className="relative">
          <h1
            // The size goes first: a later font size would discard leading-*.
            className={cn(
              titleSizeClass(artist.name),
              "break-words font-extrabold leading-tight text-white"
            )}
          >
            {artist.name}
          </h1>
          <div className="mt-1 flex items-center gap-2 text-sm font-bold text-white">
            <VerifiedIcon className="text-[#c5f0c9]" />
            Verified by Spotify
          </div>
          <div className="mt-2 text-base text-white">
            {formatCompactCount(stats.monthlyListeners)} monthly listeners
          </div>
        </div>
      </header>

      <div className="relative flex-1 bg-spotify-base">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[232px]"
          style={{
            backgroundImage: `linear-gradient(color-mix(in srgb, ${tint} 30%, #121212), transparent)`,
          }}
        />

        <div className="relative z-20 flex items-center gap-5 px-4 py-5 md:px-6">
          <PlayButton
            size="lg"
            playing={playingThis}
            label={artist.name}
            onClick={onPlay}
            className="shadow-none"
          />
          <button
            type="button"
            aria-label={`Enable Shuffle for ${artist.name}`}
            aria-pressed={shuffle}
            onClick={toggleShuffle}
            className={cn(
              "transition hover:scale-105",
              shuffle
                ? "text-spotify-green"
                : "text-spotify-subdued hover:text-white"
            )}
          >
            <Shuffle className="h-7 w-7" />
          </button>
          <button
            type="button"
            aria-pressed={following}
            onClick={() => toggleFollow(artist.name)}
            className="h-8 rounded-full border border-spotify-muted px-4 text-sm font-bold text-white transition hover:scale-105 hover:border-white"
          >
            {following ? "Following" : "Follow"}
          </button>
          <button
            type="button"
            aria-label={`More options for ${artist.name}`}
            onClick={() => showCloneNotice("More options")}
            className="text-spotify-subdued transition hover:scale-105 hover:text-white"
          >
            <MoreIcon className="h-6 w-6" />
          </button>
        </div>

        <div ref={sentinelRef} aria-hidden="true" className="relative h-px" />

        <div className="relative px-4 pb-8 md:px-6">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">Popular</h2>
            <div role="table" aria-label={`Popular songs by ${artist.name}`}>
              {visiblePopular.map((track, index) => (
                <CollectionTrackRow
                  key={track.id}
                  kind="artist"
                  track={track}
                  index={index}
                  list={popular}
                  sourceId={card.id}
                  sourceName={artist.name}
                  view="list"
                />
              ))}
            </div>
            {popular.length > POPULAR_COLLAPSED_COUNT && (
              <button
                type="button"
                onClick={() => setShowAllPopular((value) => !value)}
                className="mt-2 px-4 py-4 text-sm font-bold text-white/70 transition hover:text-white"
              >
                {showAllPopular ? "Show less" : "See more"}
              </button>
            )}
          </section>

          {pick && (
            <section className="mb-10">
              <h2 className="mb-4 text-2xl font-bold">Artist pick</h2>
              <Link
                href={pick.href}
                className="group relative block h-[250px] w-full max-w-[343px] overflow-hidden rounded-lg"
              >
                <CoverArt
                  seed={pick.coverSeed}
                  className="absolute inset-0 aspect-auto h-full rounded-lg"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/80"
                />
                <span className="absolute left-4 top-4 flex h-7 items-center gap-2 rounded-full bg-white pl-1 pr-3 text-sm text-black">
                  <CoverArt
                    seed={artist.id}
                    shape="circle"
                    variant="person"
                    className="!w-5"
                  />
                  Posted By {artist.name}
                </span>
                <span className="absolute inset-x-4 bottom-4 flex items-center gap-3">
                  <CoverArt
                    seed={pick.coverSeed}
                    className="!w-[76px] shrink-0 rounded"
                  />
                  <span className="min-w-0">
                    <span className="line-clamp-2 text-base font-bold text-white group-hover:underline">
                      {pick.title}
                    </span>
                    <span className="block text-sm text-spotify-subdued">
                      {pick.typeLabel}
                    </span>
                  </span>
                </span>
              </Link>
            </section>
          )}

          <Shelf
            title="Discography"
            items={releaseCards}
            headerExtra={
              <FilterChips
                options={availableFilters}
                value={discography}
                onChange={setDiscography}
                className="mb-2 mt-3 px-3"
              />
            }
          />
          <Shelf title={`Featuring ${artist.name}`} items={shelves.featuring} />

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">About</h2>
            <button
              type="button"
              aria-label={`About ${artist.name}`}
              onClick={() => setAboutOpen(true)}
              className="group relative block h-[clamp(320px,60cqw,516px)] w-full overflow-hidden rounded-lg text-left"
            >
              <ArtistBackdrop seed={artist.id} className="absolute inset-0" />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"
              />
              {stats.rank !== null && (
                <span className="absolute right-10 top-10 transition-transform group-hover:scale-105">
                  <RankBadge rank={stats.rank} />
                </span>
              )}
              <span className="absolute inset-x-6 bottom-6 md:inset-x-10 md:bottom-10">
                <span className="mb-2 block text-base font-bold text-white">
                  {stats.monthlyListeners.toLocaleString("en-US")} monthly
                  listeners
                </span>
                <span className="line-clamp-3 max-w-[592px] text-base text-white">
                  {bio[0]}
                </span>
              </span>
            </button>
          </section>

          <Shelf title="Discovered on" items={shelves.discovered} />
          <Shelf title="Fans also like" items={shelves.fans} />
          <Shelf title="Appears On" items={shelves.appearsOn} />
        </div>
      </div>

      <SiteFooter />

      <ArtistAboutDialog
        open={aboutOpen}
        onOpenChange={setAboutOpen}
        artistId={artist.id}
        name={artist.name}
        bio={bio}
        followers={stats.followers}
        monthlyListeners={stats.monthlyListeners}
        rank={stats.rank}
      />
    </div>
  );
}
