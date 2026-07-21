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

export const weeklyStats: Record<WeekId, WeekStats> = {
  current: {
    id: "current",
    label: "Questa settimana",
    range: "20/07 - 26/07",
    days: [
      { day: "Lun", steps: 5200, activityMinutes: 40, water: 1800, completedActivities: 3 },
      { day: "Mar", steps: 6100, activityMinutes: 25, water: 2000, completedActivities: 4 },
      { day: "Mer", steps: 4800, activityMinutes: 50, water: 1500, completedActivities: 2 },
      { day: "Gio", steps: 7300, activityMinutes: 35, water: 2200, completedActivities: 5 },
      { day: "Ven", steps: 5600, activityMinutes: 45, water: 1900, completedActivities: 3 },
      { day: "Sab", steps: 9100, activityMinutes: 60, water: 2500, completedActivities: 6 },
      { day: "Dom", steps: 3200, activityMinutes: 20, water: 1200, completedActivities: 1 },
    ],
  },
  previous: {
    id: "previous",
    label: "Settimana scorsa",
    range: "13/07 - 19/07",
    days: [
      { day: "Lun", steps: 4800, activityMinutes: 30, water: 1600, completedActivities: 2 },
      { day: "Mar", steps: 5200, activityMinutes: 35, water: 1700, completedActivities: 3 },
      { day: "Mer", steps: 6000, activityMinutes: 20, water: 1400, completedActivities: 2 },
      { day: "Gio", steps: 5100, activityMinutes: 40, water: 2000, completedActivities: 4 },
      { day: "Ven", steps: 4300, activityMinutes: 25, water: 1500, completedActivities: 2 },
      { day: "Sab", steps: 7800, activityMinutes: 55, water: 2300, completedActivities: 5 },
      { day: "Dom", steps: 2600, activityMinutes: 15, water: 1000, completedActivities: 1 },
    ],
  },
};
