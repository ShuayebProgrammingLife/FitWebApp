import type { Workout } from "./types";

const BASE = "https://api.abcz.workers.dev/api/fitlog";
const REQUEST_TIMEOUT = 10_000;

function isWorkout(value: unknown): value is Workout {
  if (!value || typeof value !== "object") return false;
  const w = value as Record<string, unknown>;
  return typeof w.id === "number" && Number.isInteger(w.id) && w.id > 0 &&
    typeof w.name === "string" && typeof w.image === "string" &&
    Array.isArray(w.muscleGroups) && w.muscleGroups.every((g) => typeof g === "string") &&
    typeof w.equipment === "string" && typeof w.difficulty === "string" &&
    typeof w.duration === "number" && typeof w.caloriesBurned === "number" &&
    typeof w.sets === "number" && typeof w.reps === "string" &&
    typeof w.rating === "number" && typeof w.description === "string" &&
    Array.isArray(w.instructions) && w.instructions.every((step) => typeof step === "string");
}

function signalWithTimeout(signal?: AbortSignal) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  const abort = () => controller.abort();
  signal?.addEventListener("abort", abort, { once: true });
  return { signal: controller.signal, cleanup: () => { clearTimeout(timeout); signal?.removeEventListener("abort", abort); } };
}

export async function getWorkouts(signal?: AbortSignal): Promise<Workout[]> {
  const request = signalWithTimeout(signal);
  try {
    const res = await fetch(BASE, { signal: request.signal, cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load workouts");
    const data: unknown = await res.json();
    if (!Array.isArray(data) || !data.every(isWorkout)) throw new Error("Unexpected API response");
    return data;
  } finally {
    request.cleanup();
  }
}

// when workout does not exit => resolves to "null"

export async function getWorkout(id: string, signal?: AbortSignal): Promise<Workout | null> {
  if (!/^\d+$/.test(id) || Number(id) <= 0) return null;
  const request = signalWithTimeout(signal);
  try {
    const res = await fetch(`${BASE}/${encodeURIComponent(id)}`, { signal: request.signal, cache: "no-store" });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to load workout");
    const data: unknown = await res.json();
    return isWorkout(data) ? data : null;
  } finally {
    request.cleanup();
  }
}