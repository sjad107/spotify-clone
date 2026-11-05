"use client";

import { useAuth } from "./auth-provider";
import { GuestGateProvider } from "./guest-gate";
import { PanelProvider } from "./panel-provider";
import { PlayerProvider } from "./player-provider";

/**
 * Keyed by whether anyone is logged in, so logging in or out starts the
 * player, library and panels from fresh. Renaming yourself keeps them.
 */
export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <GuestGateProvider>
      <PlayerProvider key={user ? "user" : "guest"}>
        <PanelProvider>{children}</PanelProvider>
      </PlayerProvider>
    </GuestGateProvider>
  );
}
