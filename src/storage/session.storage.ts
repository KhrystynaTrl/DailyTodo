import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "dailytodo:session";

// Dati di sessione salvati su disco: mai la password.
export type SessionUser = {
  id: number;
  email: string;
  name?: string;
  surname?: string;
  phone?: string;
  birthDate?: string;
  profilePicture?: string;
  bio?: string;
};

export async function loadSession(): Promise<SessionUser | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as SessionUser) : null;
}

export async function saveSession(user: SessionUser): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
