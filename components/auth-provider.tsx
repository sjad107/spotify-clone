"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  clearedSessionCookie,
  sessionCookie,
  type SessionUser,
} from "@/lib/session";

interface AuthValue {
  /** Null means a guest. */
  user: SessionUser | null;
  logIn: (name: string) => void;
  logOut: () => void;
  rename: (name: string) => void;
  /**
   * undefined shows the default picture, null shows the placeholder, and a
   * string is a photo chosen this session. Photos aren't uploaded or kept.
   */
  avatarUrl: string | null | undefined;
  setAvatarUrl: (url: string | null) => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: SessionUser | null;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState(initialUser);
  const [avatarUrl, setAvatarUrlState] = useState<string | null | undefined>();

  const setAvatarUrl = useCallback((url: string | null) => {
    setAvatarUrlState((previous) => {
      // Chosen photos are object URLs, which have to be released.
      if (previous) URL.revokeObjectURL(previous);
      return url;
    });
  }, []);

  const logIn = useCallback((name: string) => {
    document.cookie = sessionCookie(name);
    setUser({ name });
  }, []);

  const logOut = useCallback(() => {
    document.cookie = clearedSessionCookie;
    setUser(null);
    setAvatarUrlState(undefined);
  }, []);

  const value = useMemo(
    () => ({
      user,
      logIn,
      logOut,
      rename: logIn,
      avatarUrl,
      setAvatarUrl,
    }),
    [avatarUrl, logIn, logOut, setAvatarUrl, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
