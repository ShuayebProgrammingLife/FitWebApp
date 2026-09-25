import { container } from "@/lib/ui"

export default function Footer(){
  return(
    <footer className="border-t border-[#1a1d24] bg-[#090a0d]">
      <div className={`${container} flex flex-col items-center justify-between gap-3 py-10 sm:flex-row`}>
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" width={20} height={20} />
          <span className="font-display text-sm font-bold uppercase tracking-[0.05em]">FitLog</span>
        </div>
        <p className="text-center text-xs text-[#6b7280]">© 2026 FitLog — Workout Library. Train hard, log honest.</p>
      </div>
    </footer>
  )
}