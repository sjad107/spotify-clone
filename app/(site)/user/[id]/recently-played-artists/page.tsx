import ProfileListPage from "@/components/profile-list-page";
import { checkProfileRoute } from "@/lib/profile-route";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await checkProfileRoute(id, `/user/${id}/recently-played-artists`, { privateList: true });
  return <ProfileListPage profileId={id} kind="recent-artists" />;
}