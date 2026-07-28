export type WeekId = "current" | "previous";

export type MetricKey =
  | "steps"
  | "activityMinutes"
  | "water"
  | "completedActivities";

export interface DayStat {
  day: string; // etichetta breve del giorno: "Lun", "Mar", ...
  steps: number;
  activityMinutes: number;
  water: number; // in ml
  completedActivities: number;
}

export interface WeekStats {
  id: WeekId;
  label: string;
  range: string;
  days: DayStat[];
}

// Passi e minuti di attività non hanno ancora una fonte reale (nessun
// pedometro collegato): restano valori fittizi, sovrapposti nel service ai
// dati reali di acqua e attività completate che arrivano dal backend.
export const fakeStepsAndActivity: Record<
  WeekId,
  { steps: number; activityMinutes: number }[]
> = {
  current: [
    { steps: 5200, activityMinutes: 40 },
    { steps: 6100, activityMinutes: 25 },
    { steps: 4800, activityMinutes: 50 },
    { steps: 7300, activityMinutes: 35 },
    { steps: 5600, activityMinutes: 45 },
    { steps: 9100, activityMinutes: 60 },
    { steps: 3200, activityMinutes: 20 },
  ],
  previous: [
    { steps: 4800, activityMinutes: 30 },
    { steps: 5200, activityMinutes: 35 },
    { steps: 6000, activityMinutes: 20 },
    { steps: 5100, activityMinutes: 40 },
    { steps: 4300, activityMinutes: 25 },
    { steps: 7800, activityMinutes: 55 },
    { steps: 2600, activityMinutes: 15 },
  ],
};
