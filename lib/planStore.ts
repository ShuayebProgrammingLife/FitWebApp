export interface PlanState {
  plan: number[];
  saved: number[];
  done: number[];
}

const KEY = "fitlog:v1";
export const EMPTY_STATE: PlanState = { plan: [], saved: [], done: [] };

let cache: PlanState = EMPTY_STATE;
let lastRaw: string | null = null;
const listeners = new Set<() => void>();

const ids = (v: unknown): number[] =>
  Array.isArray(v) ? v.filter((n): n is number => typeof n === "number") : [];

function parse(raw: string | null): PlanState {
  if (!raw) return EMPTY_STATE;
  try {
    const p = JSON.parse(raw) as Partial<PlanState>;
    return { plan: ids(p.plan), saved: ids(p.saved), done: ids(p.done) };
  } catch {
    return EMPTY_STATE;
  }
}

const emit = () => listeners.forEach((l) => l());

export const planStore = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    window.addEventListener("storage", cb);
    return () => {
      listeners.delete(cb);
      window.removeEventListener("storage", cb);
    };
  },
  getSnapshot(): PlanState {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(KEY);
    } catch {
      return cache; // storage blocked: keep in-memory state
    }
    if (raw !== lastRaw) {
      lastRaw = raw;
      cache = parse(raw);
    }
    return cache;
  },
  getServerSnapshot(): PlanState {
    return EMPTY_STATE;
  },
  set(next: PlanState) {
    cache = next;
    try {
      const s = JSON.stringify(next);
      localStorage.setItem(KEY, s);
      lastRaw = s;
    } catch {
      /* ignore quota / private-mode errors */
    }
    emit();
  },
};