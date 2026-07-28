// Preferenze utente reali contro il backend Spring Boot (/api/settings).
// L'accesso biometrico resta locale: è una feature simulata senza equivalente
// nel SettingsResponse del backend.
import {
  loadBiometricEnabled,
  saveBiometricEnabled,
} from "../storage/preferences.storage";
import { apiFetch } from "./api.client";

export type Language = "it" | "en";
export type ThemeSetting = "light" | "dark" | "system";

export interface Preferences {
  notificationsEnabled: boolean;
  appointmentNotifications: boolean;
  goalNotifications: boolean;
  language: Language;
  dailyWaterGoalMl: number;
  theme: ThemeSetting;
  biometricEnabled: boolean;
}

export const defaultPreferences: Preferences = {
  notificationsEnabled: true,
  appointmentNotifications: true,
  goalNotifications: true,
  language: "it",
  dailyWaterGoalMl: 2000,
  theme: "system",
  biometricEnabled: false,
};

type SettingsResponse = {
  dailyWaterGoalMl: number;
  notificationEnabled: boolean;
  notificationAppointmentsEnabled: boolean;
  notificationGoalsEnabled: boolean;
  theme: string;
  language: string;
  updatedAt: string;
};

function toTheme(value: string): ThemeSetting {
  return value === "light" || value === "dark" ? value : "system";
}

export async function getPreferences(): Promise<Preferences> {
  const [settings, biometricEnabled] = await Promise.all([
    apiFetch<SettingsResponse>("/api/settings"),
    loadBiometricEnabled(),
  ]);

  return {
    notificationsEnabled: settings.notificationEnabled,
    appointmentNotifications: settings.notificationAppointmentsEnabled,
    goalNotifications: settings.notificationGoalsEnabled,
    language: settings.language === "en" ? "en" : "it",
    dailyWaterGoalMl: settings.dailyWaterGoalMl,
    theme: toTheme(settings.theme),
    biometricEnabled,
  };
}

export async function updatePreferences(
  preferences: Preferences,
): Promise<Preferences> {
  await saveBiometricEnabled(preferences.biometricEnabled);

  await apiFetch<SettingsResponse>("/api/settings", {
    method: "PUT",
    body: {
      dailyWaterGoalMl: preferences.dailyWaterGoalMl,
      notificationEnabled: preferences.notificationsEnabled,
      notificationAppointmentsEnabled: preferences.appointmentNotifications,
      notificationGoalsEnabled: preferences.goalNotifications,
      theme: preferences.theme,
      language: preferences.language,
    },
  });

  return preferences;
}
