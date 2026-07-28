// L'accesso biometrico è una feature simulata, per-dispositivo: non ha
// equivalente sul backend (SettingsResponse), resta quindi in AsyncStorage.
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "dailytodo:biometric-enabled";

export async function loadBiometricEnabled(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw === "true";
}

export async function saveBiometricEnabled(value: boolean): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, String(value));
}
