import { coverParams, type CoverPattern } from "@/lib/cover";
import { cn } from "@/lib/utils";

interface CoverArtProps {
  seed: string;
  shape?: "square" | "circle";
  variant?: "art" | "person" | "placeholder";
  /** Text printed on the artwork. Leave unset at small sizes. */
  label?: string;
  className?: string;
}

const PATTERN_STROKE = "rgba(255,255,255,0.28)";

function Pattern({
  pattern,
  a,
  b,
}: {
  pattern: CoverPattern;
  a: number;
  b: number;
}) {
  switch (pattern) {
    case "rings":
      return (
        <g fill="none" stroke={PATTERN_STROKE} strokeWidth="1.5">
          {[12, 24, 36, 48, 60, 72].map((r) => (
            <circle key={r} cx={30 + a} cy={30 + b} r={r} />
          ))}
        </g>
      );
    case "stripes":
      return (
        <g
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="6"
          transform={`rotate(${a * 4} 50 50)`}
        >
          {[-40, -20, 0, 20, 40, 60, 80, 100, 120, 140].map((x) => (
            <line key={x} x1={x} y1="-50" x2={x} y2="150" />
          ))}
        </g>
      );
    case "sun":
      return (
        <g>
          <circle cx={30 + a} cy="48" r="26" fill="rgba(255,255,255,0.32)" />
          <rect x="0" y="62" width="100" height="38" fill="rgba(0,0,0,0.28)" />
          <rect x="0" y="70" width="100" height="2" fill={PATTERN_STROKE} />
          <rect x="0" y="80" width="100" height="3" fill={PATTERN_STROKE} />
        </g>
      );
    case "waves":
      return (
        <g fill="none" stroke={PATTERN_STROKE} strokeWidth="2">
          {[10, 25, 40, 55, 70, 85].map((y) => (
            <path
              key={y}
              d={`M-10 ${y} Q ${15 + a / 2} ${y - 18} 40 ${y} T 90 ${y} T 140 ${y}`}
            />
          ))}
        </g>
      );
    case "blobs":
      return (
        <g>
          <circle cx={20 + a} cy={25 + b / 2} r="30" fill="rgba(255,255,255,0.2)" />
          <circle cx={85 - a / 2} cy={75 - b / 2} r="38" fill="rgba(0,0,0,0.22)" />
          <circle cx="60" cy="40" r="14" fill="rgba(255,255,255,0.24)" />
        </g>
      );
    case "arcs":
      return (
        <g fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="5">
          {[20, 40, 60, 80, 100, 120].map((r) => (
            <circle key={r} cx={a < 20 ? 0 : 100} cy="100" r={r} />
          ))}
        </g>
      );
  }
}

/**
 * Generated placeholder artwork. Each seed always gets the same gradient and
 * pattern, so the app has no image dependencies.
 */
export default function CoverArt({
  seed,
  shape = "square",
  variant = "art",
  label,
  className,
}: CoverArtProps) {
  const { from, to, angle, pattern, offsetA, offsetB } = coverParams(seed);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative aspect-square w-full overflow-hidden",
        shape === "circle" ? "rounded-full" : "rounded-md",
        className
      )}
      style={{
        background:
          variant === "placeholder"
            ? "#282828"
            : `linear-gradient(${angle}deg, ${from}, ${to})`,
        containerType: "inline-size",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        {variant === "placeholder" ? (
          // A person with a music note, for profiles without a photo.
          <g fill="none" stroke="#b3b3b3" strokeWidth="3" strokeLinecap="round">
            <circle cx="44" cy="38" r="11" />
            <path d="M24 70c2-11 10-17 20-17 5 0 9 1 12 4" />
            <path d="M64 50v18" />
            <circle cx="60" cy="69" r="4" />
            <path d="M64 50l8 3" />
          </g>
        ) : variant === "person" ? (
          <g fill="rgba(0,0,0,0.32)">
            <circle cx="50" cy="40" r="17" />
            <ellipse cx="50" cy="92" rx="34" ry="30" />
          </g>
        ) : (
          <Pattern pattern={pattern} a={offsetA} b={offsetB} />
        )}
      </svg>
      {label && (
        <span
          className="absolute bottom-[6cqw] left-[7cqw] right-[7cqw] line-clamp-2 font-extrabold leading-[1.05] text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.35)]"
          style={{ fontSize: "12cqw" }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
