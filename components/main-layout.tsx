import React from "react";
import NavBar from "./nav-bar";
import SideBar from "./side-bar";
import BottomBar from "./bottom-bar";
import MobileNav from "./mobile-nav";
import { PanelProvider } from "./panel-provider";
import { PlayerProvider } from "./player-provider";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <PlayerProvider>
      <PanelProvider>
        <div className="flex h-full w-full flex-col">
          <NavBar />
          <SideBar className="min-h-0 flex-1">{children}</SideBar>
          <BottomBar />
          <MobileNav />
        </div>
      </PanelProvider>
    </PlayerProvider>
  );
};

export default MainLayout;
