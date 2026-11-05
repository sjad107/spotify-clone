import { notFound } from "next/navigation";
import PlaylistPage from "@/components/playlist-page";
import { playlistById } from "@/lib/mock-data";

export default async function Playlist({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!playlistById(id)) notFound();
  return <PlaylistPage playlistId={id} />;
}
