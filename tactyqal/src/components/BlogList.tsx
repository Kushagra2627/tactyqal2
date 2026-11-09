"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";
import type { Post } from "@/lib/data";

export default function BlogList({ posts }: { posts: Post[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const cats = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.category)))], [posts]);

  const shown = useMemo(
    () =>
      posts.filter(
        (p) =>
          (cat === "All" || p.category === cat) &&
          (p.title + p.excerpt).toLowerCase().includes(q.toLowerCase())
      ),
    [posts, q, cat]
  );

  const featured = cat === "All" && !q && shown.length > 0 ? shown[0] : null;
  const gridPosts = featured ? shown.slice(1) : shown;

  return (
    <div>
      {/* Search & Filter Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-8 border-b border-line/60">
        {/* Search Input */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
          <input
            aria-label="Search articles"
            placeholder="Search by topic, keyword..."
            className="input pl-10 pr-9 py-2.5 rounded-xl border-line/80 focus:border-lagoon focus:ring-2 focus:ring-lagoon/20"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => {
            const isSelected = c === cat;
            return (
              <button
                key={c}
                aria-pressed={isSelected}
                onClick={() => setCat(c)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all sm:text-sm ${
                  isSelected
                    ? "bg-lagoon text-white shadow-md shadow-lagoon/20"
                    : "border border-line/80 bg-white text-ink/75 hover:border-lagoon/40 hover:text-ink"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Article (When on All and not searching) */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 mb-12"
        >
          <Link
            href={`/blog/${featured.slug}`}
            className="group relative grid gap-6 overflow-hidden rounded-2xl border border-line bg-white p-4 shadow-sm transition-all hover:border-lagoon/40 hover:shadow-xl md:grid-cols-12 md:p-6"
          >
            <div className="relative aspect-video overflow-hidden rounded-xl bg-mist md:col-span-7">
              <img
                loading="lazy"
                src={featured.cover}
                alt={featured.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-sun px-3 py-1 text-xs font-bold text-ink">
                <Sparkles className="h-3 w-3" /> Featured Article
              </div>
            </div>

            <div className="flex flex-col justify-center md:col-span-5 md:py-2">
              <div className="flex items-center gap-3 text-xs font-medium text-ink/60">
                <span className="rounded-md bg-lagoon/10 px-2 py-0.5 text-xs font-semibold text-lagoon">
                  {featured.category}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {featured.read} min read
                </span>
              </div>

              <h2 className="mt-3 font-display text-2xl font-bold leading-tight text-ink group-hover:text-lagoon transition-colors lg:text-3xl">
                {featured.title}
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-ink/75 lg:text-base">
                {featured.excerpt}
              </p>

              <div className="mt-6 flex items-center gap-1.5 text-sm font-bold text-lagoon">
                <span>Read complete story</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Empty State */}
      {shown.length === 0 ? (
        <div className="my-16 rounded-2xl border border-line bg-white p-12 text-center">
          <Search className="mx-auto h-10 w-10 text-ink/30" />
          <h3 className="mt-4 font-display text-lg font-bold text-ink">
            No articles match your criteria
          </h3>
          <p className="mt-1 text-sm text-ink/60">
            Try adjusting your search query or selecting a different category filter.
          </p>
          <button
            onClick={() => {
              setQ("");
              setCat("All");
            }}
            className="btn-primary mt-5 text-xs"
          >
            Reset filters
          </button>
        </div>
      ) : (
        /* Regular Cards Grid */
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {gridPosts.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <Link
                href={`/blog/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line/80 bg-white shadow-sm transition-all hover:border-lagoon/40 hover:shadow-lg"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-mist">
                  <img
                    loading="lazy"
                    src={p.cover}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-ink/80 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-md">
                    {p.category}
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                  <div>
                    <div className="flex items-center gap-3 text-xs font-medium text-ink/55">
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

                    <h3 className="mt-3 font-display text-lg font-bold text-ink transition-colors group-hover:text-lagoon">
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
      )}
    </div>
  );
}
