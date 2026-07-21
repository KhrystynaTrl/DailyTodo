import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatDate } from "../utils/date";

const STORAGE_KEY = "dailytodo:water";

export interface WaterEntry {
  id: number;
  quantita: number;
  orario: string;
}

export interface WaterState {
  date: string;
  entries: WaterEntry[];
}

const emptyState = (): WaterState => ({
  date: formatDate(new Date()),
  entries: [],
});

export async function loadWaterState(): Promise<WaterState> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);

  if (!raw) return emptyState();

  const parsed: WaterState = JSON.parse(raw);
  const today = formatDate(new Date());

  if (parsed.date !== today) {
    return emptyState();
  }

  return parsed;
}

export async function saveWaterState(state: WaterState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
