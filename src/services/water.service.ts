// Acqua consumata reale contro il backend Spring Boot (/api/water).
import { formatTime } from "../utils/date";
import { apiFetch } from "./api.client";

export interface WaterEntry {
  id: number;
  quantita: number;
  orario: string;
}

export interface WaterState {
  entries: WaterEntry[];
  goalMl: number;
}

type BeWaterEntry = {
  id: number;
  amountMl: number;
  loggedAt: string;
  createdAt: string;
};

type BeWaterToday = {
  totalMl: number;
  goalMl: number;
  goalReached: boolean;
  entries: BeWaterEntry[];
};

function toWaterEntry(be: BeWaterEntry): WaterEntry {
  return {
    id: be.id,
    quantita: be.amountMl,
    orario: formatTime(new Date(be.loggedAt)),
  };
}

export async function getWaterState(): Promise<WaterState> {
  const today = await apiFetch<BeWaterToday>("/api/water/today");
  return { entries: today.entries.map(toWaterEntry), goalMl: today.goalMl };
}

export async function addWaterEntry(quantita: number): Promise<WaterState> {
  if (quantita <= 0) {
    throw new Error("La quantità deve essere maggiore di zero");
  }

  await apiFetch<BeWaterEntry>("/api/water", {
    method: "POST",
    body: { amountMl: quantita },
  });

  return getWaterState();
}

export async function removeWaterEntry(id: number): Promise<WaterState> {
  await apiFetch<void>(`/api/water/${id}`, { method: "DELETE" });
  return getWaterState();
}
