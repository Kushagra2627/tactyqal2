"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import { createPost, getCategories, getTags } from "@/lib/api";
import type { Category, Tag } from "@/lib/api";
import {
  Save,
  Send,
  ArrowLeft,
  Tag as TagIcon,
  FolderTree,
  ImageIcon,
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewPostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [cover, setCover] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
    getTags().then(setTags).catch(() => {});
  }, []);

  // Auto-generate slug from title unless manually edited
  useEffect(() => {
    if (!slugManual) {
      setSlug(slugify(title));
    }
  }, [title, slugManual]);

  const markDirty = useCallback(() => setDirty(true), []);

  const handleSave = async (desiredStatus: "draft" | "published") => {
    setError("");
    setSuccess("");
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!slug.trim()) {
      setError("Slug is required.");
      return;
    }
    setSaving(true);
    try {
      const catObj = categories.find((c) => c.id === categoryId);
      await createPost({
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        body: body.trim(),
        cover: cover.trim() || "https://www.tactyqal.com/application/assets/images/blog-ele.png",
        category: catObj?.name || categoryName || "General",
        status: desiredStatus,
        read: Math.max(1, Math.round(body.split(" ").length / 200)) || 3,
        date: new Date().toISOString().split("T")[0]
      });
      setDirty(false);
      setSuccess(desiredStatus === "published" ? "Article published!" : "Draft saved!");
      setTimeout(() => router.push("/admin/posts"), 1200);
    } catch (err: any) {
      setError(err?.message || "Failed to save post.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="New Article"
      action={
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Posts
        </Link>
      }
    >
      {/* Unsaved indicator */}
      {dirty && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-700">
          <AlertCircle className="h-4 w-4" />
          You have unsaved changes.
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-medium text-red-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main editor — left 2/3 */}
        <div className="space-y-5 lg:col-span-2">
          {/* Title */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Your article headline…"
              value={title}
              onChange={(e) => { setTitle(e.target.value); markDirty(); }}
              className="input w-full text-base font-semibold text-slate-900 placeholder:text-slate-300 focus:border-lagoon"
            />
          </div>

          {/* Slug */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-lagoon focus-within:bg-white transition-colors">
              <span className="shrink-0 text-xs text-slate-400 font-mono">/blog/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugManual(true);
                  markDirty();
                }}
                className="flex-1 bg-transparent text-xs font-mono text-slate-700 outline-none placeholder:text-slate-300"
                placeholder="article-slug-here"
              />
            </div>
            {!slugManual && title && (
              <p className="mt-1.5 text-[11px] text-slate-400">Auto-generated from title. Click to edit.</p>
            )}
          </div>

          {/* Excerpt */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Excerpt
            </label>
            <textarea
              rows={3}
              placeholder="A brief summary shown in blog listings…"
              value={excerpt}
              onChange={(e) => { setExcerpt(e.target.value); markDirty(); }}
              className="input w-full resize-none text-sm text-slate-700 leading-relaxed focus:border-lagoon"
            />
            <p className="mt-1.5 text-[11px] text-slate-400">{excerpt.length}/200 characters recommended</p>
          </div>

          {/* Body */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Article Body
            </label>
            <textarea
              rows={18}
              placeholder="Write your article content here. Markdown is supported…"
              value={body}
              onChange={(e) => { setBody(e.target.value); markDirty(); }}
              className="input w-full resize-y font-mono text-sm text-slate-700 leading-relaxed focus:border-lagoon"
            />
            <p className="mt-1.5 text-[11px] text-slate-400">
              ~{Math.max(1, Math.round(body.split(" ").filter(Boolean).length / 200))} min read ·{" "}
              {body.split(" ").filter(Boolean).length} words
            </p>
          </div>
        </div>

        {/* Sidebar — right 1/3 */}
        <div className="space-y-5">
          {/* Publish Actions */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Publish</p>
            <div className="space-y-3">
              <button
                onClick={() => handleSave("published")}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-lagoon px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-lagoon-dark transition-all disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {saving ? "Publishing…" : "Publish Now"}
              </button>
              <button
                onClick={() => handleSave("draft")}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                Save as Draft
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              <FolderTree className="h-3.5 w-3.5" />
              Category
            </label>
            {categories.length > 0 ? (
              <select
                className="input w-full text-sm focus:border-lagoon"
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  markDirty();
                }}
              >
                <option value="">— Select category —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder="e.g. Pitching"
                value={categoryName}
                onChange={(e) => { setCategoryName(e.target.value); markDirty(); }}
                className="input w-full text-sm focus:border-lagoon"
              />
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                <TagIcon className="h-3.5 w-3.5" />
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => {
                  const checked = selectedTags.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setSelectedTags((prev) =>
                          checked ? prev.filter((id) => id !== t.id) : [...prev, t.id]
                        );
                        markDirty();
                      }}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                        checked
                          ? "bg-lagoon text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cover Image */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              <ImageIcon className="h-3.5 w-3.5" />
              Cover Image URL
            </label>
            <input
              type="url"
              placeholder="https://example.com/image.png"
              value={cover}
              onChange={(e) => { setCover(e.target.value); markDirty(); }}
              className="input w-full text-sm focus:border-lagoon"
            />
            {cover && (
              <div className="mt-3 overflow-hidden rounded-lg border border-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cover} alt="Cover preview" className="w-full h-32 object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
              </div>
            )}
          </div>

          {/* Status */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Status
            </label>
            <div className="flex gap-2">
              {(["draft", "published"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setStatus(s); markDirty(); }}
                  className={`flex-1 rounded-lg py-2 text-xs font-semibold capitalize transition-colors ${
                    status === s
                      ? s === "published"
                        ? "bg-emerald-500 text-white"
                        : "bg-amber-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
