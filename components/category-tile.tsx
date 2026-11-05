import Link from "next/link";
import type { Category } from "@/lib/mock-data";
import CoverArt from "./cover-art";

export default function CategoryTile({ category }: { category: Category }) {
  return (
    <Link
      href={`/search/${encodeURIComponent(category.name)}`}
      className="relative block aspect-[16/9] overflow-hidden rounded-lg transition-[filter] hover:brightness-110"
      style={{ backgroundColor: category.color }}
    >
      <CoverArt
        seed={category.id}
        className="absolute -bottom-[6%] -right-[6%] w-[38%] rotate-[25deg] rounded shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
      />
      <span className="absolute left-3 right-3 top-3 text-base font-bold leading-tight text-white [overflow-wrap:anywhere] md:left-4 md:right-4 md:top-4 md:text-2xl md:leading-tight">
        {category.name}
      </span>
    </Link>
  );
}
