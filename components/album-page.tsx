"use client";

import { useMemo } from "react";
import { coverColor } from "@/lib/cover";
import {
  albumById,
  albumRelease,
  albums,
  artistById,
  toCard,
  tracks as allTracks,
} from "@/lib/mock-data";
import ArtistLink from "./artist-link";
import CollectionView from "./collection-view";
import CoverArt from "./cover-art";
import { usePlayer } from "./player-provider";
import Shelf from "./shelf";

export default function AlbumPage({ albumId }: { albumId: string }) {
  const { savedCollectionIds, toggleSavedCollection } = usePlayer();
  const album = albumById(albumId);

  const tracks = useMemo(
    () => allTracks.filter((t) => t.albumId === albumId),
    [albumId]
  );
  const moreByArtist = useMemo(
    () =>
      albums
        .filter((a) => a.artistId === album?.artistId && a.id !== albumId)
        .map((a) => ({ ...toCard(a), subtitle: String(a.year) })),
    [album?.artistId, albumId]
  );

  // The route checks the id before rendering this.
  if (!album) return null;

  const card = toCard(album);
  const artistName = artistById(album.artistId)?.name ?? "";
  const { date, copyright, phonogram } = albumRelease(album);

  return (
    <CollectionView
      kind="album"
      sourceId={card.id}
      collectionId={album.id}
      title={album.title}
      typeLabel={album.kind}
      meta={
        <>
          <CoverArt
            seed={album.artistId}
            shape="circle"
            variant="person"
            className="mr-1 !w-6"
          />
          <ArtistLink
            name={artistName}
            className="font-bold text-white hover:underline"
          />
          <span>• {album.year}</span>
        </>
      }
      tint={coverColor(album.id)}
      cover={<CoverArt seed={album.id} className="rounded" />}
      tracks={tracks}
      save={{
        saved: savedCollectionIds.has(card.id),
        onToggle: () => toggleSavedCollection(card.id),
      }}
    >
      <div className="px-4 pb-6 text-xs text-spotify-subdued md:px-6">
        <p className="mb-1 text-sm">{date}</p>
        <p>{copyright}</p>
        <p>{phonogram}</p>
      </div>
      <div className="px-4 pt-4 md:px-6">
        <Shelf title={`More by ${artistName}`} items={moreByArtist} />
      </div>
    </CollectionView>
  );
}
