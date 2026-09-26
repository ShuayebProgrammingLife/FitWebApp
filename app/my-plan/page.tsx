"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useWorkouts } from "@/hooks/useWorkouts";
import { usePlan, type ListKey } from "@/context/PlanContext";
import { filterWorkouts } from "@/lib/search";
import { SORT_OPTIONS, sortWorkouts, type SortKey } from "@/lib/sort";
import type { Workout } from "@/lib/types";
import SearchInput from "@/components/SearchInput";
import Spinner from "@/components/Spinner";
import Stats from "@/components/Stats";
import { CheckIcon, ChevronDownIcon, XIcon } from "@/components/Icons";

function MyPlanContent() {
  const { plan, saved, done, hydrated, toggleDone, removeFrom } = usePlan();
  const { status, workouts, reload } = useWorkouts();
  // The active tab lives in the URL (?tab=saved) so navbar badges and the back button work
  const tab: ListKey = useSearchParams().get("tab") === "saved" ? "saved" : "plan";
  const [sort, setSort] = useState<SortKey>("Duration");
  const [query, setQuery] = useState("");

  const loading = status === "loading" || !hydrated;

  const byId = new Map<number, Workout>(workouts.map((w) => [w.id, w]));
  const resolve = (ids: number[]) => ids.map((id) => byId.get(id)).filter((w): w is Workout => Boolean(w));

  const planItems = resolve(plan);
  const tabItems = tab === "plan" ? planItems : resolve(saved);
  const items = sortWorkouts(filterWorkouts(tabItems, query), sort);

  const metrics: [string, number][] = [
    ["Exercises", planItems.length],
    ["Minutes", planItems.reduce((n, w) => n + w.duration, 0)],
    ["Calories", planItems.reduce((n, w) => n + w.caloriesBurned, 0)],
  ];

  const tabLink = (key: ListKey, label: string) => (
    <Link href={`/my-plan?tab=${key}`} scroll={false} role="tab" aria-selected={tab === key}
      className={`rounded-lg px-4 py-1.5 text-xs transition-colors ${
        tab === key
          ? "border border-[#2b303d] bg-[#1f242d] font-bold text-white shadow-md shadow-black/30"
          : "border border-transparent text-muted2 hover:text-white"
      }`}>
      {label}
    </Link>
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-12">
      <h1 className="font-display text-3xl font-bold uppercase leading-tight tracking-tight">My Plan</h1>
      <p className="mt-2 text-sm text-muted2">Cap of five lifts for today. Finish them, then load more.</p>

      {/* Metrics */}
      <div className="mt-6 grid divide-y divide-[#232732] rounded-2xl border border-[#232732] bg-[#13161d] p-6 pt-8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {metrics.map(([label, value], i) => (
          <div key={label} className={`py-3 sm:py-0 ${i === 0 ? "sm:pr-6" : "sm:px-8"}`}>
            <p className="text-xs text-muted2">{label}</p>
            <p className={`font-display text-4xl font-bold leading-[1.1] ${i === 0 ? "text-lime" : "text-white"}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Tabs + sort */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-2">
        <div role="tablist" className="inline-flex gap-1 rounded-xl border border-[#232732] bg-[#151921] p-1">
          {tabLink("plan", "Today's Plan")}
          {tabLink("saved", "Saved")}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <SearchInput value={query} onChange={setQuery} placeholder="Search by name or tag" label="Search your workouts" />
          <label className="flex items-center gap-3 text-xs text-muted2">
            Sort By
            <span className="relative">
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
                className="appearance-none rounded-[9px] border border-[#232732] bg-[#13161d] py-2 pl-3 pr-8 text-xs text-white">
                {SORT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDownIcon size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted" />
            </span>
          </label>
        </div>
      </div>

      <div className="mt-6">
        {loading && status !== "error" && <div className="py-20"><Spinner label="Loading workouts…" /></div>}

        {status === "error" && (
          <div className="py-16 text-center">
            <p className="text-sm text-muted">Couldn&apos;t load your workouts.</p>
            <button type="button" onClick={reload} className="mt-4 rounded-full bg-accent px-6 py-2.5 text-xs font-semibold text-black hover:bg-white">
              Retry
            </button>
          </div>
        )}

        {!loading && status === "ready" && items.length === 0 && query.trim() !== "" && tabItems.length > 0 && (
          <p className="py-16 text-center text-sm text-muted">No workouts match &ldquo;{query.trim()}&rdquo;.</p>
        )}

        {!loading && status === "ready" && tabItems.length === 0 && (
          <div className="flex flex-col items-center rounded-xl border border-white/10 bg-[#111317] px-4 py-24 text-center">
            <p className="font-display text-xl font-bold uppercase leading-none tracking-[0.035em]">Nothing here yet</p>
            <p className="mt-3 text-xs text-[#a1a1aa]">Browse the library and add a lift to get today moving.</p>
            <Link href="/" className="mt-6 rounded-full bg-[#c2f10d] px-6 py-2.5 text-xs font-semibold tracking-tight text-black shadow-lg shadow-lime/20 hover:bg-white">
              Go to workouts
            </Link>
          </div>
        )}

        {!loading && status === "ready" && items.length > 0 && (
          <ul className="space-y-4">
            {items.map((w) => {
              const isDone = tab === "plan" && done.includes(w.id);
              return (
                <li key={w.id} className="flex flex-col gap-4 rounded-2xl border border-[#232732] bg-[#14171e] p-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="h-20 w-36 shrink-0 overflow-hidden rounded-xl bg-[#1f2937]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={w.image} alt={w.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h3 className={`font-display text-base font-bold uppercase tracking-wide ${isDone ? "text-muted line-through" : ""}`}>
                        {w.name}
                      </h3>
                      <p className="text-xs font-semibold text-muted2">{w.equipment}</p>
                      <Stats w={w} tone="row" className="mt-1.5 gap-x-3" />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link href={`/workout/${w.id}`}
                      className="rounded-full border border-[#374151] px-4.5 py-2 text-xs text-white transition-colors hover:border-lime hover:text-lime">
                      View Details
                    </Link>
                    {tab === "plan" && (
                      <button type="button" onClick={() => toggleDone(w)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold shadow-md transition-colors ${
                          isDone ? "border border-lime text-lime" : "bg-lime text-black shadow-lime/20 hover:bg-white"
                        }`}>
                        <CheckIcon size={14} /> {isDone ? "Done" : "Mark as Done"}
                      </button>
                    )}
                    <button type="button" onClick={() => removeFrom(tab, w)} aria-label={`Remove ${w.name}`}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-red-400">
                      <XIcon size={16} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function MyPlan() {
  // useSearchParams needs a Suspense boundary for static prerendering
  return (
    <Suspense fallback={<div className="py-32"><Spinner label="Loading workouts…" /></div>}>
      <MyPlanContent />
    </Suspense>
  );
}