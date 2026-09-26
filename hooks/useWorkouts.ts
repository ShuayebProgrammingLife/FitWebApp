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
    const controller = new AbortController();
    getWorkouts(controller.signal)
      .then((workouts) => live && setState({ status: "ready", workouts }))
      .catch(() => live && setState({ status: "error", workouts: [] }));
    return () => {
      live = false;
      controller.abort();
    };
  }, [attempt]);

  const reload = useCallback(() => {
    setState((s) => ({ ...s, status: "loading" }));
    setAttempt((a) => a + 1);
  }, []);

  return { ...state, reload };
}