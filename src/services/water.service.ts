import {
  WaterEntry,
  WaterState,
  loadWaterState,
  saveWaterState,
} from "../storage/water.storage";
import { formatDate, formatTime } from "../utils/date";

export const WATER_GOAL_ML = 2000;

export function getWaterState(): Promise<WaterState> {
  return loadWaterState();
}

export async function addWaterEntry(quantita: number): Promise<WaterState> {
  if (quantita <= 0) {
    throw new Error("La quantità deve essere maggiore di zero");
  }

  const state = await loadWaterState();
  const entry: WaterEntry = {
    id: Date.now(),
    quantita,
    orario: formatTime(new Date()),
  };

  const updated: WaterState = { ...state, entries: [...state.entries, entry] };
  await saveWaterState(updated);
  return updated;
}

export async function removeWaterEntry(id: number): Promise<WaterState> {
  const state = await loadWaterState();
  const updated: WaterState = {
    ...state,
    entries: state.entries.filter((entry) => entry.id !== id),
  };
  await saveWaterState(updated);
  return updated;
}

export async function resetWaterState(): Promise<WaterState> {
  const state: WaterState = { date: formatDate(new Date()), entries: [] };
  await saveWaterState(state);
  return state;
}
