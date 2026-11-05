"use client";

import { useAuth } from "./auth-provider";
import { GuestGateProvider } from "./guest-gate";
import { PanelProvider } from "./panel-provider";
import { PlayerProvider } from "./player-provider";

/**
 * Keyed by the user, so logging in or out starts the player, library and
 * panels from fresh instead of leaking one account's state into the next.
 */
export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <GuestGateProvider>
      <PlayerProvider key={user?.name ?? "guest"}>
        <PanelProvider>{children}</PanelProvider>
      </PlayerProvider>
    </GuestGateProvider>
  );
}
