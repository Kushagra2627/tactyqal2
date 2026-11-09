"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Palette, Code2, Rocket, ChevronRight } from "lucide-react";
import { phases } from "@/lib/data";

const phaseIcons = [Lightbulb, Palette, Code2, Rocket];

export default function Timeline() {
  const [i, setI] = useState(0);
  const p = phases[i];
  const CurrentIcon = phaseIcons[i] || Lightbulb;

  return (
    <div className="rounded-xl border border-line/80 bg-white p-5 shadow-xl transition-all sm:p-6 text-ink">
      <div className="flex items-center justify-between pb-3 border-b border-line/60">
        <span className="text-xs font-bold uppercase tracking-wider text-lagoon">
          8-Week Roadmap
        </span>
        <span className="text-xs font-semibold text-ink/60">
          Step {i + 1} of 4
        </span>
      </div>

      {/* Tab Selectors */}
      <div role="tablist" aria-label="8-week program" className="my-4 flex gap-1.5 sm:gap-2">
        {phases.map((x, n) => {
          const isSelected = n === i;
          const isPast = n < i;
          return (
            <button
              key={x.weeks}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setI(n)}
              className={`relative flex-1 rounded-lg py-2.5 px-1 text-center text-xs font-bold transition-all sm:text-sm ${
                isSelected
                  ? "bg-lagoon text-white shadow-md shadow-lagoon/20"
                  : isPast
                  ? "bg-mist text-lagoon hover:bg-mist/80"
                  : "bg-mist/60 text-ink/60 hover:bg-mist"
              }`}
            >
              <span className="block truncate">{x.weeks}</span>
              {isSelected && (
                <motion.div
                  layoutId="active-step-bar"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-sun"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Animated Content Panel */}
      <div className="min-h-[140px] pt-1" role="tabpanel">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex items-start gap-4"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lagoon/10 text-lagoon">
              <CurrentIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-ink sm:text-2xl">
                {p.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/80 sm:text-base">
                {p.text}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Track & Next Button */}
      <div className="mt-4 pt-3 border-t border-line/60">
        <div className="flex items-center justify-between text-xs font-medium text-ink/60 mb-2">
          <span>Curriculum Progress</span>
          <span>{((i + 1) * 25)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-mist">
          <motion.div
            className="h-full bg-gradient-to-r from-lagoon to-sun rounded-full"
            initial={{ width: "25%" }}
            animate={{ width: `${(i + 1) * 25}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        </div>

        <div className="mt-3 flex justify-end">
          <button
            onClick={() => setI((prev) => (prev + 1) % phases.length)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-lagoon hover:text-lagoon-dark transition-colors"
          >
            {i === phases.length - 1 ? "Restart roadmap" : "Next phase"}
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
