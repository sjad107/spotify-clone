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

  const logIn = useCallback((name: string) => {
    document.cookie = sessionCookie(name);
    setUser({ name });
  }, []);

  const logOut = useCallback(() => {
    document.cookie = clearedSessionCookie;
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, logIn, logOut }), [logIn, logOut, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
