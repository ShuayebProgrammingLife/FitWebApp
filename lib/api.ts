import type { Workout } from "./types";

const BASE = "https://api.abcz.workers.dev/api/fitlog";

export async function getWorkouts () : Promise< Workout[]> {
  const res = await fetch(BASE);
  if(!res.ok){
    throw new Error("Failed to load workouts");
  }
  const data : unknown = await res.json();

  if(!Array.isArray(data)){
    throw new Error ("Unexpected API response");
  }
  return data as Workout[];
}

// when workout does not exit => resolves to "null"

export async function getWorkout(id : string) : Promise <Workout | null >{
  const res = await fetch (`${BASE}/${encodeURIComponent(id)}`);

  if(res.status === 404){
    return null;
  }
  if(!res.ok){
    throw new Error("Failed to load workout");
  }

  const data = (await res.json()) as Partial<Workout> | null;

  return data && typeof data.id === "number" ? (data as Workout) : null;
}