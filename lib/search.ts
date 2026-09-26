import type { Workout } from "./types";

export function filterWorkouts(list: Workout[], query: string): Workout[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return list;
  }

  return list.filter(
    (w) => w.name.toLowerCase().includes(q) ||
      w.muscleGroups.some((g) => g.toLowerCase().includes(q))
  );
}

