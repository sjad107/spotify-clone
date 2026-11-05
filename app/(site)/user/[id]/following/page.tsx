import ProfileListPage from "@/components/profile-list-page";
import { checkProfileRoute } from "@/lib/profile-route";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await checkProfileRoute(id, `/user/${id}/following`, { privateList: false });
  return <ProfileListPage profileId={id} kind="following" />;
}