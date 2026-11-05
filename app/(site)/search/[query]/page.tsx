import SearchResultsView from "@/components/search-results-view";

export default async function SearchResults({
  params,
}: {
  params: Promise<{ query: string }>;
}) {
  const { query } = await params;
  return <SearchResultsView query={decodeURIComponent(query)} />;
}
