"use client";
import { createContext, useCallback, useContext, useState, useSyncExternalStore, type ReactNode } from "react";
import { planStore } from "@/lib/planStore";
import type { Workout } from "@/lib/types";

export const PLAN_CAP = 5;
export type ListKey = "plan" | "saved";
type ToastType = "success" | "info" | "error";
export interface Toast { id: number; message: string; type: ToastType }

interface PlanContextValue {
  plan: number[];
  saved: number[];
  done: number[];
  hydrated: boolean;
  planFull: boolean;
  toasts: Toast[];
  dismiss: (id: number) => void;
  addToPlan: (w: Workout) => void;
  saveForLater: (w: Workout) => void;
  removeFrom: (list: ListKey, w: Workout) => void;
  toggleDone: (w: Workout) => void;
}

const PlanContext = createContext<PlanContextValue | null>(null);
let nextToastId = 0;

const subscribeNoop = () => () => {};

export function PlanProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(planStore.subscribe, planStore.getSnapshot, planStore.getServerSnapshot);
  // false during SSR/hydration, true on the client afterwards
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const notify = useCallback((message: string, type: ToastType = "success") => {
    const id = ++nextToastId;
    setToasts((t) => [...t.slice(-2), { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  const addToPlan = (w: Workout) => {
    if (state.plan.includes(w.id)) return notify(`${w.name} is already in today's plan`, "info");
    if (state.plan.length >= PLAN_CAP) return notify("Today's plan is full. Remove a lift to add another.", "error");
    planStore.set({ ...state, plan: [...state.plan, w.id] });
    notify("Added to today's plan");
  };

  const saveForLater = (w: Workout) => {
    if (state.saved.includes(w.id)) return notify(`${w.name} is already saved`, "info");
    planStore.set({ ...state, saved: [...state.saved, w.id] });
    notify("Saved for later");
  };

  const removeFrom = (list: ListKey, w: Workout) => {
    planStore.set({
      ...state,
      [list]: state[list].filter((id) => id !== w.id),
      done: list === "plan" ? state.done.filter((id) => id !== w.id) : state.done,
    });
    notify(list === "plan" ? "Removed from today's plan" : "Removed from saved");
  };

  const toggleDone = (w: Workout) => {
    const isDone = state.done.includes(w.id);
    planStore.set({ ...state, done: isDone ? state.done.filter((id) => id !== w.id) : [...state.done, w.id] });
    notify(isDone ? "Marked as not done" : `${w.name} marked as done`);
  };

  const value: PlanContextValue = {
    ...state,
    hydrated,
    planFull: state.plan.length >= PLAN_CAP,
    toasts,
    dismiss,
    addToPlan,
    saveForLater,
    removeFrom,
    toggleDone,
  };
  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan(): PlanContextValue {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used inside <PlanProvider>");
  return ctx;
}