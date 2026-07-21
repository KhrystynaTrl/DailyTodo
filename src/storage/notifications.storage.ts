import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Notification,
  notifications as seedNotifications,
} from "../mocks/notifications.mock";

const STORAGE_KEY = "dailytodo:notifications";

export async function loadNotifications(): Promise<Notification[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);

  // Primo avvio: inizializziamo lo storage con i dati mock.
  if (raw === null) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seedNotifications));
    return [...seedNotifications];
  }

  return JSON.parse(raw) as Notification[];
}

export async function saveNotifications(list: Notification[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
