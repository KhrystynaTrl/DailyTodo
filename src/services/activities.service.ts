import { Activity } from "../mocks/activities.mock";
import { loadActivities, saveActivities } from "../storage/activities.storage";

export function getActivities(): Promise<Activity[]> {
  return loadActivities();
}

export async function addActivity(
  activity: Omit<Activity, "id">,
): Promise<Activity> {
  const list = await loadActivities();
  const newActivity: Activity = {
    ...activity,
    id: Math.max(0, ...list.map((a) => a.id)) + 1,
  };
  await saveActivities([...list, newActivity]);
  return newActivity;
}

export async function updateActivity(
  id: number,
  changes: Partial<Omit<Activity, "id">>,
): Promise<Activity> {
  const list = await loadActivities();
  const index = list.findIndex((a) => a.id === id);

  if (index === -1) {
    throw new Error("Attività non trovata");
  }

  const updated: Activity = { ...list[index], ...changes };
  const next = [...list];
  next[index] = updated;
  await saveActivities(next);
  return updated;
}

export async function deleteActivity(id: number): Promise<void> {
  const list = await loadActivities();

  if (!list.some((a) => a.id === id)) {
    throw new Error("Attività non trovata");
  }

  await saveActivities(list.filter((a) => a.id !== id));
}

export async function toggleActivityCompletata(id: number): Promise<Activity> {
  const list = await loadActivities();
  const index = list.findIndex((a) => a.id === id);

  if (index === -1) {
    throw new Error("Attività non trovata");
  }

  const updated: Activity = {
    ...list[index],
    completata: !list[index].completata,
  };
  const next = [...list];
  next[index] = updated;
  await saveActivities(next);
  return updated;
}
