"use client";
import { useCallback, useEffect, useState } from "react";
import { getWorkouts } from "@/lib/api";
import type { Workout } from "@/lib/types";

type Status = "loading" | "ready" | "error";

export function useWorkouts() {
  const [state, setState] = useState<{ status: Status; workouts: Workout[] }>({ status: "loading", workouts: [] });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let live = true;
    getWorkouts()
      .then((workouts) => live && setState({ status: "ready", workouts }))
      .catch(() => live && setState({ status: "error", workouts: [] }));
    return () => {
      live = false;
    };
  }, [attempt]);

  const reload = useCallback(() => {
    setState((s) => ({ ...s, status: "loading" }));
    setAttempt((a) => a + 1);
  }, []);

  return { ...state, reload };
}