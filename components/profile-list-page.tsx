"use client";

import { useState } from "react";
import { toCard, type Entity } from "@/lib/mock-data";
import CollectionTrackRow from "./collection-track-row";
import FilterChips from "./filter-chips";
import MediaCard from "./media-card";
import SiteFooter from "./site-footer";
import { useProfile } from "./use-profile";

export type ProfileListKind =
  | "followers"
  | "following"
  | "playlists"
  | "top-artists"
  | "top-tracks"
  | "recent-artists";

const TITLES: Record<ProfileListKind, string> = {
  followers: "Followers",
  following: "Following",
  playlists: "Public Playlists",
  "top-artists": "Top artists this month",
  "top-tracks": "Top tracks this month",
  "recent-artists": "Recently played artists",
};

/** Only you can see these, so they 404 on anyone else's profile. */
export const PRIVATE_LISTS: ProfileListKind[] = [
  "top-artists",
  "top-tracks",
  "recent-artists",
];

const FOLLOWING_FILTERS = [
  { id: "all", label: "All" },
  { id: "artists", label: "Artists" },
  { id: "profiles", label: "Profiles" },
] as const;

type FollowingFilter = (typeof FOLLOWING_FILTERS)[number]["id"];

/** A profile's "Show all" pages: a title and a grid, or a tracklist. */
export default function ProfileListPage({
  profileId,
  kind,
}: {
  profileId: string;
  kind: ProfileListKind;
}) {
  const profile = useProfile(profileId);
  const [filter, setFilter] = useState<FollowingFilter>("all");

  if (!profile) return null;

  const entities: Entity[] = (() => {
    switch (kind) {
      case "followers":
        return profile.followers;
      case "following":
        return [
          ...(filter !== "profiles" ? profile.following.artists : []),
          ...(filter !== "artists" ? profile.following.profiles : []),
        ];
      case "playlists":
        return profile.playlists;
      case "top-artists":
        return profile.topArtists;
      case "recent-artists":
        return profile.recentArtists;
      case "top-tracks":
        return [];
    }
  })();

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1 px-4 pb-10 pt-16 md:px-6">
        <h1 className="text-[32px] font-bold leading-tight">{TITLES[kind]}</h1>
        {kind !== "top-tracks" && profile.isMe && kind.startsWith("top") && (
          <p className="text-sm text-spotify-subdued">Only visible to you</p>
        )}

        {kind === "following" && (
          <FilterChips
            options={FOLLOWING_FILTERS}
            value={filter}
            onChange={setFilter}
            className="mt-4"
          />
        )}

        {kind === "top-tracks" ? (
          <>
            <p className="text-sm text-spotify-subdued">Only visible to you</p>
            <div role="table" aria-label={TITLES[kind]} className="mt-6">
              {profile.topTracks.map((track, index) => (
                <CollectionTrackRow
                  key={track.id}
                  kind="profile"
                  track={track}
                  index={index}
                  list={profile.topTracks}
                  sourceId="profile:top-tracks"
                  sourceName={TITLES[kind]}
                  view="list"
                />
              ))}
            </div>
          </>
        ) : entities.length > 0 ? (
          <div className="-mx-3 mt-6 grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
            {entities.map((entity) => (
              <MediaCard
                key={`${entity.type}:${entity.id}`}
                item={toCard(entity, { playlistSubtitle: "owner" })}
              />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-base text-spotify-subdued">Nothing here yet.</p>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
