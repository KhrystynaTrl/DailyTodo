import { Activity, activities } from "../mocks/activities.mock";

const DELAY = 800;

export function getActivities(): Promise<Activity[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...activities]), DELAY);
  });
}

export function addActivity(
  activity: Omit<Activity, "id">,
): Promise<Activity> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newActivity: Activity = {
        ...activity,
        id: Math.max(0, ...activities.map((a) => a.id)) + 1,
      };
      activities.push(newActivity);
      resolve(newActivity);
    }, DELAY);
  });
}

export function updateActivity(
  id: number,
  changes: Partial<Omit<Activity, "id">>,
): Promise<Activity> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const activity = activities.find((a) => a.id === id);

      if (!activity) {
        reject(new Error("Attività non trovata"));
        return;
      }

      Object.assign(activity, changes);
      resolve(activity);
    }, DELAY);
  });
}

export function deleteActivity(id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = activities.findIndex((a) => a.id === id);

      if (index === -1) {
        reject(new Error("Attività non trovata"));
        return;
      }

      activities.splice(index, 1);
      resolve();
    }, DELAY);
  });
}

export function toggleActivityCompletata(id: number): Promise<Activity> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const activity = activities.find((a) => a.id === id);

      if (!activity) {
        reject(new Error("Attività non trovata"));
        return;
      }

      activity.completata = !activity.completata;
      resolve(activity);
    }, DELAY);
  });
}
