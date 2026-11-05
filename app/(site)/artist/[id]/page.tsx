import { notFound } from "next/navigation";
import ArtistPage from "@/components/artist-page";
import { artistById } from "@/lib/mock-data";

export default async function Artist({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!artistById(id)) notFound();
  return <ArtistPage artistId={id} />;
}
