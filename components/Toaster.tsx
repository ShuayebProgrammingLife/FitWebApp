"use client";

import { usePlan } from "@/context/PlanContext";

const tone = { success: "border-accent", info: "border-white/60", error:"border-red-500"} as const;

export default function Toaster(){
  const { toasts, dismiss } = usePlan();
  return(
    <div role="status" aria-live="polite"
          className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex-col items-center gap-2 px-4">
            {toasts.map((t) =>(
              <button key={t.id} type="button" onClick={() => dismiss(t.id)}
              className={`toast-in pointer-events-auto max-w-sm rounded-lg border-1-4 bg-[#151922] px-4 py-3 text-left text-sm font-medium shadow-lg shadow-black/50 ${tone[t.type]}`}>
                {t.message}
              </button>
            ))}
          </div>
  )
}