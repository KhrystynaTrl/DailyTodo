import { DailyStats, dailyStats } from "../mocks/dailyStats.mock";

const DELAY = 800;

export function getTodayStats(): Promise<DailyStats> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ...dailyStats }), DELAY);
  });
}
