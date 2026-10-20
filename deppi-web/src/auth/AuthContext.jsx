import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api.js";

const AuthContext = createContext(null);
const KEY = "deppi:session";

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(load); // { token, usuario }

  const logout = useCallback(() => {
    localStorage.removeItem(KEY);
    setSession(null);
  }, []);

  const login = useCallback(async (email, senha) => {
    const data = await api("/auth/login", { method: "POST", body: { email, senha }, auth: false });
    const s = { token: data.token, usuario: data.usuario };
    localStorage.setItem(KEY, JSON.stringify(s));
    setSession(s);
    return s;
  }, []);

  // Token expirado (a API devolveu 401) → desloga
  useEffect(() => {
    window.addEventListener("deppi:unauthorized", logout);
    return () => window.removeEventListener("deppi:unauthorized", logout);
  }, [logout]);

  const value = useMemo(
    () => ({
      token: session?.token ?? null,
      usuario: session?.usuario ?? null,
      cargos: session?.usuario?.cargos ?? [],
      isAuth: !!session?.token,
      login,
      logout,
    }),
    [session, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
