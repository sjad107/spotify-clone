"use client";

import { useMemo, useState } from "react";
import { Clock3 } from "lucide-react";
import {
  toCard,
  trackArtistNames,
  type Entity,
  type Track,
} from "@/lib/mock-data";
import { hasResults, search, type SearchResults } from "@/lib/search";
import { cn } from "@/lib/utils";
import CategoryTile from "./category-tile";
import CoverArt from "./cover-art";
import ExplicitBadge from "./explicit-badge";
import FilterChips from "./filter-chips";
import MediaCard from "./media-card";
import NavBarSearch from "./nav-bar-search";
import PlayButton from "./play-button";
import { usePlayer } from "./player-provider";
import Shelf from "./shelf";
import SiteFooter from "./site-footer";
import TrackRow, { TRACK_TABLE_COLUMNS } from "./track-row";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "artists", label: "Artists" },
  { id: "playlists", label: "Playlists" },
  { id: "songs", label: "Songs" },
  { id: "albums", label: "Albums" },
  { id: "podcasts", label: "Podcasts & Shows" },
  { id: "profiles", label: "Profiles" },
  { id: "audiobooks", label: "Audiobooks" },
  { id: "categories", label: "Genres & Moods" },
] as const;

type SearchFilter = (typeof FILTERS)[number]["id"];

const TOP_SONG_COUNT = 4;

const cards = (entities: Entity[]) =>
  entities.map((entity) => toCard(entity, { playlistSubtitle: "owner" }));

export default function SearchResultsView({ query }: { query: string }) {
  const [filter, setFilter] = useState<SearchFilter>("all");
  const results = useMemo(() => search(query), [query]);

  return (
    <div className="relative flex min-h-full flex-col">
      <div className="sticky top-0 z-30 bg-spotify-base px-4 py-3 md:px-10">
        <NavBarSearch className="mb-3 md:hidden" />
        <FilterChips options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      <div className="flex-1 px-4 pt-4 md:px-6">
        {!hasResults(results) ? (
          <NoResults query={query} />
        ) : filter === "all" ? (
          <AllResults results={results} query={query} />
        ) : filter === "songs" ? (
          <SongsTable tracks={results.tracks} query={query} />
        ) : filter === "categories" ? (
          <CategoryGrid results={results} query={query} />
        ) : (
          <CardGrid entities={results[filter]} query={query} />
        )}
      </div>

      <SiteFooter />
    </div>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
      <h2 className="mb-2 break-all text-2xl font-bold">
        No results found for &ldquo;{query}&rdquo;
      </h2>
      <p className="text-base text-white">
        Please make sure your words are spelled correctly, or use fewer or
        different keywords.
      </p>
    </div>
  );
}

function AllResults({
  results,
  query,
}: {
  results: SearchResults;
  query: string;
}) {
  const topSongs = results.tracks.slice(0, TOP_SONG_COUNT);

  return (
    <>
      {results.top && (
        <div className="mb-8 grid grid-cols-1 gap-x-3 gap-y-6 [@container_(min-width:800px)]:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <section>
            <h2 className="mb-2 text-2xl font-bold">Top result</h2>
            <TopResultCard entity={results.top} />
          </section>
          {topSongs.length > 0 && (
            <section className="min-w-0">
              <h2 className="mb-2 text-2xl font-bold">Songs</h2>
              {topSongs.map((track, index) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  list={results.tracks}
                  listId={`search-songs:${query}`}
                  listName="Search results"
                  index={index}
                />
              ))}
            </section>
          )}
        </div>
      )}

      {results.featuring && (
        <Shelf
          title={`Featuring ${results.featuring.artist.name}`}
          items={cards(results.featuring.playlists)}
        />
      )}
      <Shelf title="Artists" items={cards(results.artists)} />
      <Shelf title="Albums" items={cards(results.albums)} />
      <Shelf title="Playlists" items={cards(results.playlists)} />
      <Shelf title="Podcasts" items={cards(results.podcasts)} />
      <Shelf title="Audiobooks" items={cards(results.audiobooks)} />
      <Shelf title="Profiles" items={cards(results.profiles)} />
      {results.categories.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-2xl font-bold">Genres &amp; Moods</h2>
          <CategoryGrid results={results} query={query} />
        </section>
      )}
    </>
  );
}

function topResultSubtitle(entity: Entity) {
  switch (entity.type) {
    case "track":
      return (
        <>
          {entity.explicit && <ExplicitBadge />}
          Song • <span className="text-white">{trackArtistNames(entity)}</span>
        </>
      );
    case "artist":
      return "Artist";
    case "album":
      return (
        <>
          {entity.kind} •{" "}
          <span className="text-white">{toCard(entity).subtitle}</span>
        </>
      );
    case "playlist":
      return `Playlist • By ${entity.owner}`;
    case "show":
      return `${entity.kind} • ${entity.publisher}`;
    case "profile":
      return "Profile";
  }
}

function TopResultCard({ entity }: { entity: Entity }) {
  const { sourceId, isPlaying, toggleSource } = usePlayer();
  const card = toCard(entity);
  const active = sourceId === card.id;
  const playing = active && isPlaying;
  const onToggle = () => toggleSource(card.id, card.playables, card.sourceName);

  return (
    <div className="group relative h-[225px] rounded-lg bg-spotify-card p-5 transition-colors duration-200 hover:bg-spotify-elevated">
      <CoverArt
        seed={card.coverSeed}
        shape={card.shape}
        variant={card.variant}
        className="mb-5 !w-[92px] shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
      />
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "block w-full truncate pb-1 text-left text-[32px] font-bold leading-[39px] after:absolute after:inset-0 after:rounded-lg",
          active ? "text-spotify-green" : "text-white"
        )}
      >
        {card.title}
      </button>
      <div className="truncate pr-14 text-sm text-spotify-subdued">
        {topResultSubtitle(entity)}
      </div>
      <PlayButton
        playing={playing}
        label={card.title}
        onClick={onToggle}
        className={cn(
          "absolute bottom-5 right-5 z-10 translate-y-2 opacity-0 transition-all duration-200 focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100",
          playing && "translate-y-0 opacity-100"
        )}
      />
    </div>
  );
}

function SongsTable({ tracks, query }: { tracks: Track[]; query: string }) {
  if (tracks.length === 0) return <NoResults query={query} />;

  return (
    <div>
      <div
        className={cn(
          "mb-2 hidden items-center gap-3 border-b border-white/10 px-2 pb-2 text-sm text-spotify-subdued [@container_(min-width:560px)]:grid",
          TRACK_TABLE_COLUMNS
        )}
      >
        <span className="text-right">#</span>
        <span>Title</span>
        <span>Album</span>
        <span className="flex items-center justify-end gap-3" aria-label="Duration">
          <span className="w-4" />
          <span className="flex w-10 justify-end">
            <Clock3 className="h-4 w-4" />
          </span>
          <span className="w-4" />
        </span>
      </div>
      {tracks.map((track, index) => (
        <TrackRow
          key={track.id}
          track={track}
          list={tracks}
          listId={`search-songs:${query}`}
                  listName="Search results"
          index={index}
          detailed
        />
      ))}
    </div>
  );
}

function CardGrid({ entities, query }: { entities: Entity[]; query: string }) {
  if (entities.length === 0) return <NoResults query={query} />;

  return (
    <div className="-mx-3 grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
      {cards(entities).map((item) => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function CategoryGrid({
  results,
  query,
}: {
  results: SearchResults;
  query: string;
}) {
  if (results.categories.length === 0) return <NoResults query={query} />;

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6 md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
      {results.categories.map((category) => (
        <CategoryTile key={category.id} category={category} />
      ))}
    </div>
  );
}
