import CategoryTile from "@/components/category-tile";
import NavBarSearch from "@/components/nav-bar-search";
import SiteFooter from "@/components/site-footer";
import { categories } from "@/lib/mock-data";

export default function Search() {
  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1 px-4 pt-4 md:px-6 md:pt-16">
        <NavBarSearch className="mb-6 md:hidden" />
        <h2 className="mb-4 text-2xl font-bold">Browse all</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] md:gap-6">
          {categories.map((category) => (
            <CategoryTile key={category.id} category={category} />
          ))}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
