import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { setOnSessionExpired } from "../services/api.client";
import {
  LoginPayload,
  login as loginRequest,
  register as registerRequest,
} from "../services/auth.service";
import {
  ProfileUpdate,
  updatePassword as updateUserPassword,
  updateProfile as updateUserProfile,
} from "../services/profile.service";
import {
  SessionUser,
  clearSession,
  loadSession,
  saveSession,
} from "../storage/session.storage";
import { clearTokens, saveTokens } from "../storage/token.storage";

type RegisterPayload = {
  name: string;
  surname: string;
  email: string;
  password: string;
};

type AuthContextType = {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  updateProfile: (changes: ProfileUpdate) => Promise<void>;
  updatePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  // Ripristina la sessione salvata al precedente avvio.
  useEffect(() => {
    loadSession()
      .then((saved) => {
        if (saved) setUser(saved);
      })
      .finally(() => setIsHydrating(false));
  }, []);

  // Se il refresh token risulta scaduto/non valido durante una chiamata
  // autenticata, forziamo il logout locale.
  useEffect(() => {
    setOnSessionExpired(() => {
      setUser(null);
      clearSession().catch(() => {});
    });
    return () => setOnSessionExpired(null);
  }, []);

  const login = async (payload: LoginPayload) => {
    const { tokens, user: loggedInUser } = await loginRequest(payload);
    await saveTokens(tokens);
    setUser(loggedInUser);
    await saveSession(loggedInUser);
  };

  const register = async ({ name, surname, email, password }: RegisterPayload) => {
    const { tokens, user: newUser } = await registerRequest({
      email,
      password,
      firstName: name,
      lastName: surname,
    });
    await saveTokens(tokens);
    setUser(newUser);
    await saveSession(newUser);
  };

  const updateProfile = async (changes: ProfileUpdate) => {
    if (!user) throw new Error("Utente non autenticato");
    const updated = await updateUserProfile(user, changes);
    setUser(updated);
    await saveSession(updated);
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    if (!user) throw new Error("Utente non autenticato");
    await updateUserPassword(currentPassword, newPassword);
  };

  const logout = () => {
    setUser(null);
    clearSession().catch(() => {});
    clearTokens().catch(() => {});
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user ? true : false,
      isHydrating,
      login,
      register,
      updateProfile,
      updatePassword,
      logout,
    }),
    [user, isHydrating],
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
