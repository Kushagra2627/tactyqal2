"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { faqs } from "@/lib/data";

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative bg-white py-20 lg:py-28 border-t border-line/60">
      <div className="mx-auto max-w-3xl px-4">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-lagoon/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-lagoon">
            <HelpCircle className="h-3.5 w-3.5" /> Frequently Asked Questions
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Questions parents ask
          </h2>
          <p className="mt-2 text-base text-ink/70">
            Everything you need to know about our teen mentorship program and weekly commitments.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="mt-12 space-y-3">
          {faqs.map(([q, a], idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={q}
                className="overflow-hidden rounded-xl border border-line/80 bg-mist/30 transition-colors hover:border-lagoon/30"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors"
                >
                  <span className="font-display text-base font-bold text-ink sm:text-lg">
                    {q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-ink/70 shadow-sm"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="border-t border-line/40 px-5 pb-5 pt-3 text-sm leading-relaxed text-ink/80 sm:text-base">
                        {a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
