"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlan } from "@/context/PlanContext";
import { container } from "@/lib/ui";

export default function Navbar() {
  const pathname = usePathname();
  const { plan, saved } = usePlan();
  const workoutsActive = pathname === "/";
  const planActive = pathname === "/my-plan";

  const linkClass = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-xs transition-colors ${
      active ? "bg-[#1a2312] font-semibold text-accent" : "font-medium text-muted hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-[#1b1f28] bg-bg">
      {/* 3-column grid: logo | nav (centered) | badges. On mobile the nav drops to its own row. */}
      <div className={`${container} grid min-h-20 grid-cols-[1fr_auto] items-center gap-y-2 py-3 sm:grid-cols-[1fr_auto_1fr] sm:py-0`}>
        <Link href="/" className="flex items-center gap-2.5 justify-self-start" aria-label="FitLog home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" width={28} height={28} />
          <span className="font-display text-lg font-bold uppercase tracking-[0.05em]">FitLog</span>
        </Link>

        <nav aria-label="Main" className="order-last col-span-2 flex justify-center sm:order-none sm:col-span-1">
          <Link href="/" className={linkClass(workoutsActive)} aria-current={workoutsActive ? "page" : undefined}>
            Workouts
          </Link>
          <Link href="/my-plan" className={linkClass(planActive)} aria-current={planActive ? "page" : undefined}>
            My Plan
          </Link>
        </nav>

        <div className="flex items-center gap-5 justify-self-end text-xs font-medium">
          <Link href="/my-plan?tab=plan" aria-label={`Plan, ${plan.length} items`} className="flex items-center gap-2 text-[#d1d5db]">
            Plan
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-black">
              {plan.length}
            </span>
          </Link>
          <Link href="/my-plan?tab=saved" aria-label={`Saved, ${saved.length} items`} className="flex items-center gap-2 text-muted">
            Saved
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full border border-[#2d313b] px-1 text-[11px] text-[#d1d5db]">
              {saved.length}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}