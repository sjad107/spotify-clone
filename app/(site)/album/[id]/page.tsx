import { notFound } from "next/navigation";
import AlbumPage from "@/components/album-page";
import { albumById } from "@/lib/mock-data";

export default async function Album({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!albumById(id)) notFound();
  return <AlbumPage albumId={id} />;
}
