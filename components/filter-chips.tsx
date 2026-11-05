import { cn } from "@/lib/utils";

interface FilterChipsProps<T extends string> {
  options: ReadonlyArray<{ id: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export default function FilterChips<T extends string>({
  options,
  value,
  onChange,
  className,
}: FilterChipsProps<T>) {
  return (
    <div className={cn("no-scrollbar flex gap-2 overflow-x-auto", className)}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={option.id === value}
          onClick={() => onChange(option.id)}
          className={cn(
            "h-8 shrink-0 whitespace-nowrap rounded-full px-3 text-sm transition-colors",
            option.id === value
              ? "bg-white text-black"
              : "bg-white/10 text-white hover:bg-white/20"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
