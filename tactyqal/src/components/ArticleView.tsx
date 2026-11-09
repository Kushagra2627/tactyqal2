"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Share2, Copy, Check, Twitter, Linkedin } from "lucide-react";
import type { Post } from "@/lib/data";
import { company } from "@/lib/data";

export default function ArticleView({ post }: { post: Post }) {
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setProgress(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)));
      }
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareTwitter = () => {
    if (typeof window !== "undefined") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`,
        "_blank"
      );
    }
  };

  const shareLinkedin = () => {
    if (typeof window !== "undefined") {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
        "_blank"
      );
    }
  };

  return (
    <div className="relative">
      {/* 1. Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-lagoon via-teal-400 to-sun origin-left transition-all duration-75"
        style={{ width: `${progress}%` }}
      />

      <article className="mx-auto max-w-3xl px-4 py-12 lg:py-16">
        {/* Back navigation */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-lagoon hover:text-lagoon-dark transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all articles
        </Link>

        {/* Category & Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-ink/60">
          <span className="rounded-full bg-lagoon/10 px-3 py-1 text-xs font-bold text-lagoon">
            {post.category}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {post.date}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {post.read} min read
          </span>
        </div>

        {/* Headline */}
        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl leading-tight">
          {post.title}
        </h1>

        {/* Author / Publisher Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-line/60 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-lagoon text-white font-bold flex items-center justify-center font-display shadow-sm">
              TL
            </div>
            <div>
              <p className="text-sm font-bold text-ink">Tactyqal Labs Editorial</p>
              <p className="text-xs text-ink/60">Startup Mentorship & Product Engineering</p>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              title="Copy link"
              className="flex h-9 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-xs font-semibold text-ink/80 hover:bg-mist transition-colors shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              onClick={shareTwitter}
              title="Share on X"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-ink/80 hover:bg-mist transition-colors shadow-sm"
            >
              <Twitter className="h-4 w-4" />
            </button>
            <button
              onClick={shareLinkedin}
              title="Share on LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-ink/80 hover:bg-mist transition-colors shadow-sm"
            >
              <Linkedin className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Featured Cover Image */}
        <div className="my-8 overflow-hidden rounded-2xl border border-line shadow-lg">
          <img
            src={post.cover}
            alt={post.title}
            className="w-full object-cover max-h-[480px]"
          />
        </div>

        {/* Article Excerpt Callout */}
        {post.excerpt && (
          <div className="my-6 rounded-xl border-l-4 border-lagoon bg-mist/60 p-5 text-base italic text-ink/80 leading-relaxed">
            "{post.excerpt}"
          </div>
        )}

        {/* Article Body */}
        <div className="prose prose-lg max-w-none text-ink/90 leading-8 space-y-5 text-lg">
          {post.body.startsWith("<") ? (
            <div dangerouslySetInnerHTML={{ __html: post.body }} />
          ) : (
            <p>{post.body}</p>
          )}
        </div>

        {/* Bottom Call to Action Card */}
        <div className="mt-16 rounded-2xl border border-line bg-gradient-to-br from-ink to-slate-900 p-8 text-white shadow-xl">
          <h3 className="font-display text-2xl font-bold">
            Inspire your teen to build real software
          </h3>
          <p className="mt-2 text-sm text-white/80 max-w-xl leading-relaxed">
            From validating initial problem spaces to shipping live no-code prototypes, Tactyqal Labs provides personalized 1:1 guidance every step of the way.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href={company.booking}
              className="btn-primary bg-lagoon hover:bg-lagoon-dark text-white font-semibold text-sm"
            >
              Book Free Consultation
            </a>
            <Link
              href="/blog"
              className="btn-ghost border-white/20 text-white hover:bg-white/10 text-sm"
            >
              Browse More Articles
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
