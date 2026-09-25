"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getWorkout } from "@/lib/api";
import { container } from "@/lib/ui";
import type { Workout } from "@/lib/types";
import { usePlan } from "@/context/PlanContext";
import NotFoundView from "@/components/NotFoundView";
import Spinner from "@/components/Spinner";
import { ArrowLeftIcon, BookmarkIcon, PlusIcon } from "@/components/Icons";

type Result = { id: string; status: "ready" | "missing" | "error"; workout?: Workout };

export default function WorkoutDetail() {
  const { id } = useParams<{ id: string }>();
  const { plan, planFull, addToPlan, saveForLater } = usePlan();
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    let live = true;
    getWorkout(id)
      .then((w) => live && setResult(w ? { id, status: "ready", workout: w } : { id, status: "missing" }))
      .catch(() => live && setResult({ id, status: "error" }));
    return () => {
      live = false;
    };
  }, [id]);

  // A result for a different id -> still loading the current one
  const current = result && result.id === id ? result : null;

  if (!current) {
    return <div className="py-32"><Spinner label="Loading workout…" /></div>;
  }
  if (current.status === "error") {
    return <NotFoundView title="Couldn't load workout" text="Something went wrong while fetching this lift. Try again from the library." />;
  }
  if (current.status === "missing" || !current.workout) {
    return <NotFoundView title="Workout not found" text="We couldn't find that workout. Pick another from the library." />;
  }

  const w = current.workout;
  const blocked = planFull && !plan.includes(w.id);
  const specs: [string, string | number][] = [
    ["Equipment", w.equipment],
    ["Difficulty", w.difficulty],
    ["Sets", w.sets],
    ["Reps", w.reps],
    ["Duration", `${w.duration} min`],
    ["Calories", `${w.caloriesBurned} kcal`],
    ["Rating", w.rating],
  ];

  return (
    <div className={`${container} py-12`}>
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-muted hover:text-accent">
        <ArrowLeftIcon size={14} /> Back to workouts
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
        {/* Left: media */}
        <div className="overflow-hidden rounded-2xl border border-[#232834] bg-[#171a21] shadow-xl shadow-black/40 lg:self-start">
          
          <img src={w.image} alt={w.name} className="aspect-[4/5] w-full object-cover" />
        </div>

        {/* Right: info */}
        <div>
          <h1 className="font-display text-4xl font-bold uppercase leading-[1.1] tracking-[-0.025em]">{w.name}</h1>
          <p className="mt-3 text-base text-muted">{w.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {w.muscleGroups.map((g) => (
              <span key={g} className="rounded-full bg-lime px-3.5 py-1 text-xs font-semibold text-bg">{g}</span>
            ))}
          </div>

          <dl className="mt-7 divide-y divide-[#1e2330] overflow-hidden rounded-2xl border border-[#232834] bg-[#151922]">
            {specs.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 px-6 py-3.5">
                <dt className="text-xs font-bold uppercase tracking-[0.05em] text-muted">{label}</dt>
                <dd className="text-sm font-medium text-[#e5e7eb]">{value}</dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-8 text-base font-extrabold uppercase tracking-[0.05em]">Instructions</h2>
          <ol className="mt-4 space-y-3">
            {w.instructions.map((step, i) => (
              <li key={step} className="flex gap-2 text-sm leading-relaxed">
                <span className="text-muted">{i + 1}.</span>
                <span className="text-[#d1d5db]">{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <button type="button" onClick={() => addToPlan(w)} disabled={blocked}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime px-6 py-3 text-sm font-semibold text-bg shadow-[0_0_24px_rgba(204,255,0,0.2)] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50">
              <PlusIcon size={16} /> Add to today&apos;s plan
            </button>
            <button type="button" onClick={() => saveForLater(w)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#374151] px-6 py-3 text-sm font-medium text-[#e5e7eb] transition-colors hover:border-lime hover:text-lime">
              <BookmarkIcon size={16} /> Save for later
            </button>
          </div>
          {blocked && (
            <p className="mt-3 text-xs text-red-400">Today&apos;s plan is full (5 of 5). Remove a lift to add this one.</p>
          )}
        </div>
      </div>
    </div>
  );
}