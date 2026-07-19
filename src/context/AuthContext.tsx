import React, { createContext, useContext, useMemo, useState } from "react";
import { User, users } from "../mocks/user.mock";

type LoginPayload = {
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async ({ email, password }: LoginPayload) => {
    const userFound = users.filter(
      (user) => user.email === email && user.password === password,
    );
    if (userFound.length > 0) {
      setUser(userFound[0]);
      return;
    }
    throw new Error("Credenziali non valide");
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user ? true : false,
      login,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve essere usato dentro AuthProvider");
  }

  return context;
}
