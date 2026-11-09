"use client";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Video, Users, Sparkles, Target, Zap, ShieldCheck } from "lucide-react";

export default function MentorshipSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const features = [
    {
      icon: Users,
      title: "Direct 1:1 Mentorship",
      desc: "Every student is paired with a dedicated founder-mentor for personalized guidance each week."
    },
    {
      icon: Zap,
      title: "Modern No-Code & AI",
      desc: "Build production-ready apps using visual tools, API integrations, and modern AI automation."
    },
    {
      icon: Target,
      title: "Real Problem Solving",
      desc: "Identify authentic market problems and validate real user demand before writing a line of logic."
    },
    {
      icon: ShieldCheck,
      title: "Launch & Portfolio Ready",
      desc: "Graduate with a live, functional web or mobile app published for actual users and college applications."
    }
  ];

  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      {/* Background Decor */}
      <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-mist/60 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-80 w-80 rounded-full bg-lagoon/5 blur-2xl" />

      <div className="mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-lagoon/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-lagoon">
            <Sparkles className="h-3.5 w-3.5" /> High-Impact Mentorship
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            How 1:1 Mentoring Turns Ideas into Real Ventures
          </h2>
          <p className="mt-3 text-base text-ink/70 sm:text-lg">
            Teens don't just learn theory. In 8 weeks, they build, test, and ship complete applications with live feedback from experienced founders.
          </p>
        </motion.div>

        {/* Video & Features Grid */}
        <div className="mt-16 grid items-center gap-12 lg:grid-cols-12">
          {/* Left: Looping Mentorship Video Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6"
          >
            <div className="relative overflow-hidden rounded-2xl border border-line bg-ink p-2 shadow-2xl">
              {/* Window Controls */}
              <div className="flex items-center gap-1.5 px-3 py-2">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs font-mono text-white/40">tactyqal-mentorship-session.mp4</span>
              </div>

              {/* Looping Mentorship Video */}
              <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="h-full w-full object-cover"
                >
                  <source src="/videos/mentorship-loop.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent pointer-events-none" />

                {/* Floating Live Badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Live 1:1 Pair Ideation & Build
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Key Pillars */}
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-6">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="group rounded-xl border border-line bg-white p-5 shadow-sm transition-all hover:border-lagoon/40 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lagoon/10 text-lagoon transition-colors group-hover:bg-lagoon group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-display text-lg font-bold text-ink">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
