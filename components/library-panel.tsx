"use client";

import { cn } from "@/lib/utils";
import { useAuth } from "./auth-provider";
import Box from "./box";
import GuestLibrary from "./guest-library";
import Library from "./library";
import {
  LIBRARY_COMPACT_WIDTH,
  LIBRARY_MAX_WIDTH,
  usePanel,
} from "./panel-provider";
import ResizeHandle from "./resize-handle";

/** The left panel: 280-420px wide, or a 72px bar of covers. */
export default function LibraryPanel() {
  const { user } = useAuth();
  const { libraryWidth, libraryCompact, resizeLibrary } = usePanel();

  const width = libraryCompact ? LIBRARY_COMPACT_WIDTH : libraryWidth;

  return (
    <aside
      className={cn(
        "relative hidden shrink-0 md:block",
        width === null && "md:w-[280px] xl:w-[340px] 2xl:w-[392px]"
      )}
      style={width === null ? undefined : { width }}
    >
      <ResizeHandle
        label="Resize Your Library"
        edge="right"
        min={LIBRARY_COMPACT_WIDTH}
        max={LIBRARY_MAX_WIDTH}
        value={width ?? undefined}
        onResize={resizeLibrary}
      />
      <Box className="h-full overflow-hidden">
        {user ? (
          <Library compact={libraryCompact} />
        ) : (
          <GuestLibrary compact={libraryCompact} />
        )}
      </Box>
    </aside>
  );
}
