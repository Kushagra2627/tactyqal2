"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Rocket, CheckCircle2 } from "lucide-react";
import Timeline from "@/components/Timeline";
import { company } from "@/lib/data";

export default function HeroSection() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be restricted by browser policy; fallback will show
      });
    }
  }, []);

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-ink text-white">
      {/* 1. Cinematic Background Video with Fallback */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          className={`h-full w-full object-cover object-center transition-opacity duration-1000 ${
            videoLoaded ? "opacity-35 scale-105" : "opacity-0"
          }`}
          style={{ transition: "opacity 1.2s ease-in-out, transform 20s ease-out" }}
        >
          <source src="/videos/hero-loop.mp4" type="video/mp4" />
        </video>

        {/* Static Fallback Mesh & Poster Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-lagoon/20 via-transparent to-transparent opacity-60" />
      </div>

      {/* Floating 3D Geometric Nodes in Background */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-10 right-10 h-72 w-72 rounded-full bg-lagoon/15 blur-3xl"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -8, 0]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute bottom-10 left-10 h-80 w-80 rounded-full bg-sun/10 blur-3xl"
      />

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-12 md:items-center md:py-24">
        {/* Left Column: Value Proposition & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="md:col-span-7"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-sun backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>1:1 MENTORSHIP FOR TEENS & YOUNG FOUNDERS</span>
          </div>

          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl text-white">
            Empower your kid to build the next app that impacts millions, in{" "}
            <span className="bg-gradient-to-r from-sun via-amber-300 to-yellow-200 bg-clip-text text-transparent">
              8 weeks
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
            1:1 mentoring, from idea to full-stack app, with no coding needed.
          </p>

          {/* Key Metric Highlights */}
          <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-white/90">
            <span className="flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1 backdrop-blur-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-lagoon" /> Live 1-on-1 Mentorship
            </span>
            <span className="flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1 backdrop-blur-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-lagoon" /> No Prior Coding Needed
            </span>
            <span className="flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1 backdrop-blur-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-lagoon" /> Product Hunt Launch Ready
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={company.booking}
              className="inline-flex items-center gap-2 rounded-lg bg-lagoon px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-lagoon/30 transition-all hover:bg-lagoon-dark"
            >
              Book free consultation
              <ArrowRight className="h-4 w-4" />
            </motion.a>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="#stories"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/15 hover:border-white/40"
              >
                See success stories
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Column: Interactive Timeline Container */}
        <motion.div
          id="program"
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="md:col-span-5"
        >
          <div className="relative">
            {/* Glow Behind Timeline Card */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-lagoon/40 to-sun/20 blur-xl opacity-70" />

            <div className="relative rounded-xl border border-white/15 bg-ink/80 p-1 shadow-2xl backdrop-blur-xl">
              <Timeline />
            </div>

            <p className="mt-3 text-center text-xs text-white/70">
              Live 1:1 sessions, 1 hour each, about 2-3 hours a week in total.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
