"use client";
import { motion } from "framer-motion";
import { tools } from "@/lib/data";
import {
  Lightbulb,
  Coins,
  Users2,
  Presentation,
  Trophy,
  UserCheck,
  CheckCircle,
  Layout,
  ArrowUpRight
} from "lucide-react";

const toolIcons = [
  Lightbulb,
  Coins,
  Users2,
  Presentation,
  Trophy,
  UserCheck,
  CheckCircle,
  Layout
];

export default function ToolsSection() {
  return (
    <section id="tools" className="relative overflow-hidden bg-ink py-20 lg:py-28 text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-96 w-full max-w-4xl bg-lagoon/15 blur-3xl opacity-50" />

      <div className="relative mx-auto max-w-6xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sun">
            Proprietary Frameworks
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Free startup assessment tools
          </h2>
          <p className="mt-2 text-base text-white/70 max-w-xl mx-auto">
            Practical diagnostic frameworks designed to evaluate and sharpen early-stage business concepts.
          </p>
        </motion.div>

        {/* Tools Grid with Motion */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((t, idx) => {
            const Icon = toolIcons[idx % toolIcons.length] || Lightbulb;

            return (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -4, borderColor: "rgba(15, 118, 110, 0.6)" }}
                className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all hover:bg-white/10 hover:shadow-xl hover:shadow-lagoon/10"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-lagoon/20 text-lagoon transition-transform group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-white/40 group-hover:text-sun transition-colors" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold text-white group-hover:text-sun transition-colors">
                    {t}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
                  <span>Free Assessment</span>
                  <span className="text-lagoon font-medium">Included</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
