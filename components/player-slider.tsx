interface PlayerSliderProps {
  label: string;
  value: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string;
}

/**
 * A native range input stretched invisibly over custom visuals, which keeps
 * keyboard and pointer handling. Turns green with a thumb on hover or focus.
 */
export default function PlayerSlider({
  label,
  value,
  max,
  step = 1,
  onChange,
  className,
}: PlayerSliderProps) {
  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div className={`group relative flex h-3 w-full items-center ${className ?? ""}`}>
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/30">
        <div
          className="h-full rounded-full bg-white group-focus-within:bg-spotify-green group-hover:bg-spotify-green"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div
        className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 rounded-full bg-white opacity-0 shadow group-focus-within:opacity-100 group-hover:opacity-100"
        style={{ left: `${percent}%` }}
      />
      <input
        type="range"
        aria-label={label}
        min={0}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  );
}
