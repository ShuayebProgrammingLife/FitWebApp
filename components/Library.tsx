"use client";
import { useState } from "react";
import { useWorkouts } from "@/hooks/useWorkouts";
import { filterWorkouts } from "@/lib/search";
import { container } from "@/lib/ui";
import SearchInput from "./SearchInput";
import Spinner from "./Spinner";
import WorkoutCard from "./WorkoutCard";

export default function Library() {
  const { status, workouts, reload } = useWorkouts();
  const [query, setQuery] = useState("");
  const visible = filterWorkouts(workouts, query);

  return (
    <section id="library" className={`${container} scroll-mt-24 py-16`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold uppercase leading-tight tracking-[-0.025em]">The Library</h2>
          <p className="mt-1 text-sm text-muted">Twelve lifts covering every major muscle group.</p>
        </div>
        {status === "ready" && (
          <SearchInput value={query} onChange={setQuery} placeholder="Search by name or tag" label="Search workouts" />
        )}
      </div>

      {status === "loading" && (
        <div className="mt-8">
          <div className="mb-6"><Spinner label="Loading workouts…" /></div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-[368px] animate-pulse rounded-2xl border border-line bg-panel" />
            ))}
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="mt-8 rounded-2xl border border-line bg-panel p-10 text-center">
          <p className="font-display text-xl font-bold uppercase">Couldn&apos;t load workouts</p>
          <p className="mt-2 text-sm text-muted">Check your connection and try again.</p>
          <button type="button" onClick={reload} className="mt-6 rounded-full bg-accent px-6 py-2.5 text-xs font-semibold text-black hover:bg-white">
            Retry
          </button>
        </div>
      )}

      {status === "ready" && visible.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((w) => <WorkoutCard key={w.id} w={w} />)}
        </div>
      )}

      {status === "ready" && visible.length === 0 && (
        <p className="mt-12 text-center text-sm text-muted">No workouts match &ldquo;{query.trim()}&rdquo;.</p>
      )}
    </section>
  );
}