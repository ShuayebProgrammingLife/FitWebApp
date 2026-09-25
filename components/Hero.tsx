import { container } from "@/lib/ui";
import { ArrowDownIcon } from "./Icons";

export default function Hero() {
  return (
    <section className={`${container} pt-12`}>
      <div className="grid items-center gap-10 rounded-2xl border border-line bg-panel p-8 sm:p-14 lg:grid-cols-2">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent">Workout Library</p>
          <h1 className="mt-5 font-display text-5xl font-bold uppercase leading-none tracking-[-0.025em] sm:text-6xl">
            Train with intent. Log every set.
          </h1>
          <p className="mt-5 max-w-lg text-base text-muted">
            FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into today&apos;s plan, and watch the week&apos;s work add up.
          </p>
          {/* Plain anchor: scrolls to #library on the same page (no route change) */}
          <a href="#library"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-xs font-bold uppercase tracking-[0.025em] text-black shadow-[0_0_24px_rgba(194,248,0,0.25)] transition-colors hover:bg-white">
            Browse workouts <ArrowDownIcon size={14} />
          </a>
        </div>
        <div className="flex justify-center lg:justify-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/banner.png" alt="Athlete using a preacher curl machine" width={334} height={334} className="h-auto w-full max-w-[334px]" />
        </div>
      </div>
    </section>
  );
}