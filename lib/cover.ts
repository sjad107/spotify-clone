/** Deterministic artwork parameters, so a seed always renders the same cover. */

const PALETTES: ReadonlyArray<readonly [string, string]> = [
  ["#8e2de2", "#f107a3"],
  ["#0f766e", "#5eead4"],
  ["#b91c1c", "#fb923c"],
  ["#1d4ed8", "#38bdf8"],
  ["#4338ca", "#c084fc"],
  ["#a16207", "#fde047"],
  ["#be185d", "#fda4af"],
  ["#166534", "#a3e635"],
  ["#1e293b", "#94a3b8"],
  ["#7c2d12", "#fdba74"],
  ["#0e7490", "#a5f3fc"],
  ["#581c87", "#f0abfc"],
  ["#312e81", "#f472b6"],
  ["#14532d", "#fde68a"],
];

export const COVER_PATTERNS = [
  "rings",
  "stripes",
  "sun",
  "waves",
  "blobs",
  "arcs",
] as const;

export type CoverPattern = (typeof COVER_PATTERNS)[number];

export function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function coverParams(seed: string) {
  const hash = hashSeed(seed);
  const [from, to] = PALETTES[hash % PALETTES.length];
  return {
    from,
    to,
    angle: (hash >>> 4) % 360,
    pattern: COVER_PATTERNS[(hash >>> 8) % COVER_PATTERNS.length],
    // Small integer offsets used to vary the pattern placement.
    offsetA: (hash >>> 12) % 40,
    offsetB: (hash >>> 18) % 40,
  };
}

/** The dominant colour of a cover, used for the home page header tint. */
export function coverColor(seed: string): string {
  return coverParams(seed).from;
}
