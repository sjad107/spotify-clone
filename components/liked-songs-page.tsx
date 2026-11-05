"use client";

import { useMemo } from "react";
import { trackById, type Track } from "@/lib/mock-data";
import { useAuth } from "./auth-provider";
import CollectionView from "./collection-view";
import CoverArt from "./cover-art";
import { LikedSongsArt } from "./library";
import { usePlayer } from "./player-provider";

export default function LikedSongsPage() {
  const { user } = useAuth();
  const { likedIds } = usePlayer();
  const userName = user?.name ?? "";
  const tracks = useMemo(
    () =>
      [...likedIds]
        .map(trackById)
        .filter((t): t is Track => t !== undefined),
    [likedIds]
  );

  return (
    <CollectionView
      kind="playlist"
      sourceId="liked-songs"
      collectionId="liked-songs"
      title="Liked Songs"
      typeLabel="Playlist"
      meta={
        <>
          <CoverArt
            seed={userName}
            shape="circle"
            variant="person"
            className="mr-1 !w-6"
          />
          <span className="font-bold text-white">{userName}</span>
        </>
      }
      tint="#5038a0"
      cover={<LikedSongsArt className="w-full" />}
      tracks={tracks}
    />
  );
}
