import { WeekId, WeekStats, weeklyStats } from "../mocks/weeklyStats.mock";

const DELAY = 600;

export function getWeekStats(week: WeekId): Promise<WeekStats> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(weeklyStats[week]), DELAY);
  });
}
