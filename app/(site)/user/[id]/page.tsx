import ProfilePage from "@/components/profile-page";
import { checkProfileRoute } from "@/lib/profile-route";

export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await checkProfileRoute(id, `/user/${id}`);
  return <ProfilePage profileId={id} />;
}