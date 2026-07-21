import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { User, users } from "../mocks/user.mock";
import {
  ProfileUpdate,
  register as registerUser,
  updatePassword as updateUserPassword,
  updateProfile as updateUserProfile,
} from "../services/user.service";
import {
  SessionUser,
  clearSession,
  loadSession,
  saveSession,
} from "../storage/session.storage";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = Omit<User, "id">;

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

  // Ripristina la sessione simulata salvata al precedente avvio.
  useEffect(() => {
    loadSession()
      .then((saved) => {
        if (saved) setUser(saved);
      })
      .finally(() => setIsHydrating(false));
  }, []);

  const login = async ({ email, password }: LoginPayload) => {
    const userFound = users.filter(
      (user) => user.email === email && user.password === password,
    );
    if (userFound.length > 0) {
      setUser(userFound[0]);
      await saveSession(userFound[0]);
      return;
    }
    throw new Error("Credenziali non valide");
  };

  const register = async (payload: RegisterPayload) => {
    const newUser = await registerUser(payload);
    setUser(newUser);
    await saveSession(newUser);
  };

  const updateProfile = async (changes: ProfileUpdate) => {
    if (!user) throw new Error("Utente non autenticato");
    const updated = await updateUserProfile(user.id, changes);
    setUser(updated);
    await saveSession(updated);
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    if (!user) throw new Error("Utente non autenticato");
    await updateUserPassword(user.email, currentPassword, newPassword);
  };

  const logout = () => {
    setUser(null);
    clearSession().catch(() => {});
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
