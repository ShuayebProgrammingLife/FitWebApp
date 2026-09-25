import Link from "next/link";
import type { Workout } from "@/lib/types";
import Stats from "./Stats";

export default function WorkoutCard({ w }: { w: Workout }) {
  return (
    <Link href={`/workout/${w.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel transition-colors hover:border-accent/60">
      <div className="h-48 overflow-hidden bg-[#1f232b]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={w.image} alt={w.name} loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap gap-2">
          {w.muscleGroups.map((g) => (
            <span key={g} className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.05em] text-black">
              {g}
            </span>
          ))}
        </div>
        <h3 className="pt-2 font-display text-lg font-bold uppercase leading-snug tracking-[0.025em]">{w.name}</h3>
        <p className="mt-1 text-xs text-muted">{w.equipment}</p>
        <Stats w={w} className="mt-auto gap-x-4 border-t border-inner pt-3" />
      </div>
    </Link>
  );
}