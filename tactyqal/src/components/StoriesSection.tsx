"use client";
import { motion } from "framer-motion";
import { stories } from "@/lib/data";
import { Sparkles, Sprout, ShoppingBag, BookOpen, HeartHandshake, Music, MessageSquareQuote } from "lucide-react";

const storyIcons: Record<string, any> = {
  "KrishiDrishti": Sprout,
  "Elenor Vegan Handbags": ShoppingBag,
  "One Last Chapter": BookOpen,
  "Paws of Promise": HeartHandshake,
  "AudioNova": Music,
  "Converza": MessageSquareQuote
};

const storyCategories: Record<string, string> = {
  "KrishiDrishti": "AgriTech & AI",
  "Elenor Vegan Handbags": "E-Commerce",
  "One Last Chapter": "EdTech & Subscription",
  "Paws of Promise": "Social Good",
  "AudioNova": "Generative Media",
  "Converza": "AI EdTech"
};

export default function StoriesSection() {
  return (
    <section id="stories" className="relative bg-mist/50 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center sm:text-left sm:flex sm:items-end sm:justify-between"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sun/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-800">
              <Sparkles className="h-3.5 w-3.5" /> Proven Track Record
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Real students, real apps
            </h2>
            <p className="mt-2 text-base text-ink/70 max-w-xl">
              Teen founders discover problems they care about and transform raw concepts into working software products.
            </p>
          </div>
        </motion.div>

        {/* Stories Grid with Staggered Motion */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((s, idx) => {
            const Icon = storyIcons[s.name] || Sparkles;
            const category = storyCategories[s.name] || "Startup Project";

            return (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -5 }}
                className="group relative flex flex-col justify-between rounded-xl border border-line/80 bg-white p-6 shadow-sm transition-all hover:border-lagoon/40 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-lagoon/10 text-lagoon transition-transform group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="rounded-full bg-mist px-2.5 py-0.5 text-xs font-semibold text-ink/60">
                      {category}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-xl font-bold text-ink group-hover:text-lagoon transition-colors">
                    {s.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/75">
                    {s.text}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-line/50 flex items-center justify-between text-xs text-ink/50 font-medium">
                  <span>Mentored at Tactyqal</span>
                  <span className="text-lagoon font-semibold">Live Prototype</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Note preserved from original data */}
        <p className="mt-8 text-center text-xs text-ink/60">
          Student testimonials, revenue figures and student counts on the original website are inconsistent or unverified, so only verified projects are highlighted.
        </p>
      </div>
    </section>
  );
}
