import AsyncStorage from "@react-native-async-storage/async-storage";
import { Activity, activities as seedActivities } from "../mocks/activities.mock";

const STORAGE_KEY = "dailytodo:activities";

export async function loadActivities(): Promise<Activity[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);

  // Primo avvio: inizializziamo lo storage con i dati mock.
  if (raw === null) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seedActivities));
    return [...seedActivities];
  }

  return JSON.parse(raw) as Activity[];
}

export async function saveActivities(list: Activity[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
