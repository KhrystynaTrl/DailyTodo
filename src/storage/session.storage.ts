import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../mocks/user.mock";

const STORAGE_KEY = "dailytodo:session";

// Dati di sessione salvati su disco: mai la password.
export type SessionUser = Omit<User, "password">;

export async function loadSession(): Promise<SessionUser | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as SessionUser) : null;
}

export async function saveSession(user: User): Promise<void> {
  // Salviamo solo i campi non sensibili (la password resta esclusa).
  const safe: SessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    surname: user.surname,
    phone: user.phone,
    birthDate: user.birthDate,
    profilePicture: user.profilePicture,
    bio: user.bio,
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
