import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "dailytodo:preferences";

export type Language = "it" | "en";

export interface Preferences {
  notificationsEnabled: boolean;
  appointmentNotifications: boolean;
  goalNotifications: boolean;
  language: Language;
  biometricEnabled: boolean;
}

export const defaultPreferences: Preferences = {
  notificationsEnabled: true,
  appointmentNotifications: true,
  goalNotifications: true,
  language: "it",
  biometricEnabled: false,
};

export async function loadPreferences(): Promise<Preferences> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);

  if (!raw) return defaultPreferences;

  // Uniamo ai default per tollerare preferenze salvate con versioni precedenti.
  const parsed = JSON.parse(raw) as Partial<Preferences>;
  return { ...defaultPreferences, ...parsed };
}

export async function savePreferences(preferences: Preferences): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}
