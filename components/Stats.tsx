import type { Workout } from "@/lib/types";
import { ClockIcon, FlameIcon, StarIcon } from "./Icons";

interface Props {
  w: Workout;
  /** "card" = muted (home cards), "row" = lighter (My Plan rows) */
  tone?: "card" | "row";
  className?: string;
}

export default function Stats({ w, tone = "card", className = "" }: Props) {
  const color = tone === "row" ? "text-[#d1d5db]" : "text-muted";
  return (
    <ul className={`flex flex-wrap items-center text-xs ${color} ${className}`}>
      <li className="flex items-center gap-1.5"><ClockIcon size={14} />{w.duration} min</li>
      <li className="flex items-center gap-1.5"><FlameIcon size={14} />{w.caloriesBurned} kcal</li>
      <li className="flex items-center gap-1.5"><StarIcon size={14} />{w.rating}</li>
    </ul>
  );
}