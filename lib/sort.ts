import type { Workout } from "./types";

export type SortKey = "Duration" | "Calories" | "Rating";

export const SORT_OPTIONS: SortKey[] = ["Duration", "Calories", "Rating"];

const FIELD : Record < SortKey, "duration" | "caloriesBurned" | "rating" >={
  Duration: "duration",
  Calories: "caloriesBurned",
  Rating: "rating",
};

// retuns a new array => highest value first
export function sortWorkouts (list: Workout[], key: SortKey) : Workout[]{
  const f = FIELD[key];
  return [...list].sort((a,b) => b[f] - a[f]);
}