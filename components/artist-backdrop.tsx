import { coverParams } from "@/lib/cover";
import { cn } from "@/lib/utils";

interface ArtistBackdropProps {
  seed: string;
  /** Where the figure stands in the frame. */
  align?: "right" | "center";
  className?: string;
}

/** A generated stand-in for an artist photo: a dark gradient and a figure. */
export default function ArtistBackdrop({
  seed,
  align = "right",
  className,
}: ArtistBackdropProps) {
  const { from, to, angle } = coverParams(seed);
  const x = align === "right" ? 145 : 100;

  return (
    <div
      aria-hidden="true"
      className={cn("overflow-hidden", className)}
      style={{
        background: `linear-gradient(${angle}deg, color-mix(in srgb, ${from} 55%, black), color-mix(in srgb, ${to} 35%, black))`,
      }}
    >
      <svg
        viewBox="0 0 200 100"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <g fill="rgba(0,0,0,0.38)">
          <circle cx={x} cy="40" r="21" />
          <ellipse cx={x} cy="112" rx="48" ry="50" />
        </g>
      </svg>
    </div>
  );
}
