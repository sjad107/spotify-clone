import { cn } from "@/lib/utils";

export function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("fill-current", className)}>
      <path d="M7.05 3.606l13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z" />
    </svg>
  );
}

export function PauseGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("fill-current", className)}>
      <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z" />
    </svg>
  );
}

interface PlayButtonProps {
  playing: boolean;
  label: string;
  onClick: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/** The round green button. */
export default function PlayButton({
  playing,
  label,
  onClick,
  size = "md",
  className,
}: PlayButtonProps) {
  const Glyph = playing ? PauseGlyph : PlayGlyph;
  return (
    <button
      type="button"
      aria-label={`${playing ? "Pause" : "Play"} ${label}`}
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-spotify-green text-black shadow-[0_8px_8px_rgba(0,0,0,0.3)] transition hover:scale-105 hover:bg-spotify-green-hover active:scale-95",
        { sm: "h-8 w-8", md: "h-12 w-12", lg: "h-14 w-14" }[size],
        className
      )}
    >
      <Glyph className={size === "sm" ? "h-4 w-4" : "h-6 w-6"} />
    </button>
  );
}
