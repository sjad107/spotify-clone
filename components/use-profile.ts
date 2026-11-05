"use client";

import { useMemo } from "react";
import {
  artists,
  currentUser,
  ME_ID,
  myFollowers,
  myTopArtists,
  myTopTracks,
  profileById,
  profileFollowers,
  profileFollowing,
  profilePlaylists,
  profiles,
  recentlyPlayedArtists,
  type Artist,
  type Playlist,
  type Profile,
  type Track,
} from "@/lib/mock-data";
import { coverColor } from "@/lib/cover";
import { useAuth } from "./auth-provider";
import { usePanel } from "./panel-provider";

export interface ProfileView {
  id: string;
  isMe: boolean;
  name: string;
  /** Profiles without a photo show the placeholder icon. */
  hasPhoto: boolean;
  tint: string;
  playlists: Playlist[];
  followers: Profile[];
  following: { artists: Artist[]; profiles: Profile[] };
  /** Only the logged-in user sees these, as on Spotify. */
  topArtists: Artist[];
  topTracks: Track[];
  recentArtists: Artist[];
}

// Taken from the default profile picture, so the header matches it.
const MY_TINT = "#0088d8";

/**
 * Everything a profile page shows. Your own Following list comes from the
 * shared follow state, so it changes as you follow artists and people.
 */
export function useProfile(id: string): ProfileView | null {
  const { user } = useAuth();
  const { followedNames } = usePanel();

  return useMemo(() => {
    if (id === ME_ID) {
      if (!user) return null;
      return {
        id,
        isMe: true,
        name: user.name,
        hasPhoto: true,
        tint: MY_TINT,
        playlists: profilePlaylists(currentUser.name),
        followers: myFollowers,
        following: {
          artists: artists.filter((a) => followedNames.has(a.name)),
          profiles: profiles.filter((p) => followedNames.has(p.name)),
        },
        topArtists: myTopArtists(),
        topTracks: myTopTracks(),
        recentArtists: recentlyPlayedArtists(),
      };
    }

    const profile = profileById(id);
    if (!profile) return null;
    return {
      id,
      isMe: false,
      name: profile.name,
      hasPhoto: profile.hasPhoto,
      tint: profile.hasPhoto ? coverColor(profile.id) : "#535353",
      playlists: profilePlaylists(profile.name),
      followers: profileFollowers(profile.id),
      following: profileFollowing(profile.id),
      topArtists: [],
      topTracks: [],
      recentArtists: [],
    };
  }, [followedNames, id, user]);
}
