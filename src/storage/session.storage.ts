import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../mocks/user.mock";

const STORAGE_KEY = "dailytodo:session";

export async function loadSession(): Promise<User | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

export async function saveSession(user: User): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
