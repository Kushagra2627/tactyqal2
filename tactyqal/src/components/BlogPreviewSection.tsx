"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { Post } from "@/lib/data";

export default function BlogPreviewSection({ posts }: { posts: Post[] }) {
  return (
    <section className="relative bg-white py-20 lg:py-28 border-t border-line/60">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-lagoon">
              Insights & Frameworks
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              From the blog
            </h2>
            <p className="mt-1 text-base text-ink/70">
              Actionable advice on startup ideation, team building, and validation.
            </p>
          </div>

          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-lagoon hover:text-lagoon-dark transition-colors"
          >
            <span>View all articles</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Blog Cards Grid */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <Link
                href={`/blog/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line/80 bg-white shadow-sm transition-all hover:border-lagoon/40 hover:shadow-xl"
              >
                {/* Cover Image with Zoom Effect */}
                <div className="relative aspect-video w-full overflow-hidden bg-mist">
                  <img
                    loading="lazy"
                    src={p.cover}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    {p.category}
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center gap-3 text-xs font-medium text-ink/60">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {p.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {p.read} min read
                      </span>
                    </div>

                    <h3 className="mt-3 font-display text-xl font-bold leading-snug text-ink transition-colors group-hover:text-lagoon">
                      {p.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/75">
                      {p.excerpt}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center gap-1 pt-3 border-t border-line/60 text-xs font-bold text-lagoon">
                    <span>Read article</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
