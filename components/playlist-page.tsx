"use client";

import { useMemo } from "react";
import { coverColor } from "@/lib/cover";
import {
  ownerName,
  playlistById,
  playlistSaves,
  toCard,
  trackById,
  type Track,
} from "@/lib/mock-data";
import { useAuth } from "./auth-provider";
import CollectionView from "./collection-view";
import CoverArt from "./cover-art";
import { usePlayer } from "./player-provider";

const resolveTracks = (ids: string[]) =>
  ids.map(trackById).filter((t): t is Track => t !== undefined);

export default function PlaylistPage({ playlistId }: { playlistId: string }) {
  const { user } = useAuth();
  const { savedCollectionIds, toggleSavedCollection } = usePlayer();
  const playlist = playlistById(playlistId);
  const tracks = useMemo(
    () => resolveTracks(playlist?.trackIds ?? []),
    [playlist]
  );

  // The route checks the id before rendering this.
  if (!playlist) return null;

  const card = toCard(playlist);
  const saves = playlistSaves(playlist);

  return (
    <CollectionView
      kind="playlist"
      sourceId={card.id}
      collectionId={playlist.id}
      title={playlist.title}
      typeLabel={playlist.owner === "Spotify" ? "Public Playlist" : "Playlist"}
      description={playlist.description}
      meta={
        <>
          <CoverArt
            seed={playlist.owner}
            shape="circle"
            variant="person"
            className="mr-1 !w-6"
          />
          <span className="font-bold text-white">
            {ownerName(playlist.owner, user?.name)}
          </span>
          {saves !== null && (
            <span>• {saves.toLocaleString("en-US")} saves</span>
          )}
        </>
      }
      tint={coverColor(playlist.id)}
      cover={<CoverArt seed={playlist.id} label={card.label} className="rounded" />}
      tracks={tracks}
      save={{
        saved: savedCollectionIds.has(card.id),
        onToggle: () => toggleSavedCollection(card.id),
      }}
    />
  );
}
