import { cn } from "@/lib/utils";
import Box from "./box";
import CreditsDialog from "./credits-dialog";
import Library from "./library";
import NowPlayingExpanded from "./now-playing-expanded";
import NowPlayingPanel from "./now-playing-panel";
import PanelToast from "./panel-toast";

interface SideBarProps {
  children: React.ReactNode;
  className?: string;
}

const SideBar: React.FC<SideBarProps> = ({ children, className }) => {
  return (
    <div className={cn("relative flex gap-2 px-2 pt-2 md:pt-0", className)}>
      <aside className="hidden shrink-0 md:block md:w-[280px] xl:w-[340px] 2xl:w-[392px]">
        <Box className="h-full overflow-hidden">
          <Library />
        </Box>
      </aside>
      <Box className="h-full min-w-0 flex-1 overflow-hidden">
        {/* A size container, because this width changes with the panels. */}
        <main className="spotify-scrollbar h-full overflow-y-auto overflow-x-hidden [container-type:inline-size]">
          {children}
        </main>
      </Box>
      <NowPlayingPanel />
      <NowPlayingExpanded />
      <CreditsDialog />
      <PanelToast />
    </div>
  );
};

export default SideBar;
