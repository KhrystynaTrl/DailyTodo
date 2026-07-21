import { WeekId, WeekStats, weeklyStats } from "../mocks/weeklyStats.mock";

const DELAY = 600;

// Indice del giorno odierno in una settimana che parte da lunedì (Lun=0 … Dom=6).
// getDay() usa domenica=0, quindi lo ruotiamo di +6.
const todayIndex = (): number => (new Date().getDay() + 6) % 7;

// Nella settimana corrente i giorni ancora da vivere non hanno dati reali:
// li azzeriamo così il grafico mostra barre vuote invece di valori "dal futuro".
// La settimana scorsa è tutta nel passato e resta invariata.
function withFutureDaysEmptied(week: WeekStats): WeekStats {
  if (week.id !== "current") return week;

  const today = todayIndex();
  return {
    ...week,
    days: week.days.map((day, index) =>
      index <= today
        ? day
        : {
            ...day,
            steps: 0,
            activityMinutes: 0,
            water: 0,
            completedActivities: 0,
          },
    ),
  };
}

export function getWeekStats(week: WeekId): Promise<WeekStats> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(withFutureDaysEmptied(weeklyStats[week])), DELAY);
  });
}
