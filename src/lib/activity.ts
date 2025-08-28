export type ActivityType = "preferences" | "favorite" | "recommendation" | "general";

export interface Activity {
  id: string;
  message: string;
  type: ActivityType;
  timestamp: number;
}

const STORAGE_KEY = "recentActivities";

export function getActivities(): Activity[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addActivity(message: string, type: ActivityType = "general") {
  const activities = getActivities();
  const newActivity: Activity = {
    id: Date.now().toString(),
    message,
    type,
    timestamp: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newActivity, ...activities]));
}

export function clearActivities() {
  localStorage.removeItem(STORAGE_KEY);
}
