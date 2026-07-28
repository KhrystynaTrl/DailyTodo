// Statistiche settimanali reali contro il backend Spring Boot
// (/api/statistics/weekly). Passi e minuti attività restano fittizi: nessuna
// fonte reale (pedometro) collegata, vedi mocks/weeklyStats.mock.ts.
import { WeekId, WeekStats, fakeStepsAndActivity } from "../mocks/weeklyStats.mock";
import {
  formatDayMonth,
  mondayOf,
  parseIsoDate,
  shortDayLabel,
  toIsoDate,
} from "../utils/date";
import { apiFetch } from "./api.client";

type BeWeeklyStats = {
  startDate: string;
  endDate: string;
  days: {
    date: string;
    activitiesCompleted: number;
    appointmentsCount: number;
    waterMl: number;
  }[];
};

function weekStartFor(week: WeekId): Date {
  const monday = mondayOf(new Date());
  if (week === "previous") monday.setDate(monday.getDate() - 7);
  return monday;
}

function toWeekStats(week: WeekId, be: BeWeeklyStats): WeekStats {
  const fake = fakeStepsAndActivity[week];

  return {
    id: week,
    label: week === "current" ? "Questa settimana" : "Settimana scorsa",
    range: `${formatDayMonth(parseIsoDate(be.startDate))} - ${formatDayMonth(parseIsoDate(be.endDate))}`,
    days: be.days.map((day, index) => ({
      day: shortDayLabel(parseIsoDate(day.date)),
      steps: fake[index]?.steps ?? 0,
      activityMinutes: fake[index]?.activityMinutes ?? 0,
      water: day.waterMl,
      completedActivities: day.activitiesCompleted,
    })),
  };
}

export async function getWeekStats(week: WeekId): Promise<WeekStats> {
  const startDate = toIsoDate(weekStartFor(week));
  const be = await apiFetch<BeWeeklyStats>(
    `/api/statistics/weekly?startDate=${startDate}`,
  );
  return toWeekStats(week, be);
}
