import {
  Preferences,
  loadPreferences,
  savePreferences,
} from "../storage/preferences.storage";

export function getPreferences(): Promise<Preferences> {
  return loadPreferences();
}

export async function updatePreferences(
  preferences: Preferences,
): Promise<Preferences> {
  await savePreferences(preferences);
  return preferences;
}
