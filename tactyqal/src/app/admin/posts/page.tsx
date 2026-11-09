"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import { listPosts, deletePost, toggleStatus, getCategories } from "@/lib/api";
import type { Post } from "@/lib/data";
import {
  Search,
  PlusCircle,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Filter,
  X
} from "lucide-react";

export default function PostsAdmin() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [st, setSt] = useState("all");
  const [cat, setCat] = useState("all");
  const [confirm, setConfirm] = useState<Post | null>(null);
  const [toast, setToast] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const load = () => {
    listPosts()
      .then(setPosts)
      .catch((err) => console.error("Failed to load posts", err));
  };

  useEffect(() => {
    load();
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  const note = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 3000);
  };

  const rows = useMemo(() => {
    return (posts ?? [])
      .filter((p) => {
        const matchesQ =
          p.title.toLowerCase().includes(q.toLowerCase()) ||
          p.slug.toLowerCase().includes(q.toLowerCase());
        const matchesStatus = st === "all" || p.status === st;
        const matchesCat = cat === "all" || p.category.toLowerCase() === cat.toLowerCase();
        return matchesQ && matchesStatus && matchesCat;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [posts, q, st, cat]);

  const handleDelete = async () => {
    if (!confirm) return;
    setIsDeleting(true);
    try {
      await deletePost(confirm.id);
      setConfirm(null);
      await load();
      note(`Deleted "${confirm.title}"`);
    } catch (err: any) {
      note("Failed to delete post.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout
      title="All Articles"
      action={
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-lagoon px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-lagoon-dark transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          Create Article
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Filters & Search Header */}
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              placeholder="Search title or slug..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="input pl-9 text-sm rounded-lg border-slate-200 focus:border-lagoon"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                aria-label="Filter by status"
                className="input py-2 text-xs rounded-lg border-slate-200 bg-white"
                value={st}
                onChange={(e) => setSt(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <select
              aria-label="Filter by category"
              className="input py-2 text-xs rounded-lg border-slate-200 bg-white"
              value={cat}
              onChange={(e) => setCat(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id || c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {!posts ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Loading articles...
            </div>
          ) : rows.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-slate-300" />
              <h3 className="mt-3 text-sm font-semibold text-slate-800">No articles found</h3>
              <p className="mt-1 text-xs text-slate-500">
                Try adjusting your search criteria or create your first post.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3.5 pl-6 pr-3">Title & Slug</th>
                    <th className="px-3 py-3.5">Category</th>
                    <th className="px-3 py-3.5">Status</th>
                    <th className="px-3 py-3.5">Date</th>
                    <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((p) => {
                    const isPublished = p.status === "published";
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 pl-6 pr-3 font-medium text-slate-900">
                          <div>
                            <span className="font-semibold">{p.title}</span>
                            <span className="block font-mono text-xs text-slate-400 mt-0.5">
                              /{p.slug}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-xs font-medium text-slate-600">
                          <span className="rounded-md bg-slate-100 px-2 py-1">
                            {p.category}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              isPublished
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isPublished ? "bg-emerald-500" : "bg-amber-500"
                              }`}
                            />
                            {p.status}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-xs text-slate-500">
                          {p.date}
                        </td>
                        <td className="py-4 pl-3 pr-6 text-right space-x-2">
                          {/* Toggle Status */}
                          <button
                            onClick={async () => {
                              await toggleStatus(p.id);
                              await load();
                              note(isPublished ? "Post moved to draft" : "Post published live");
                            }}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                              isPublished
                                ? "text-amber-700 bg-amber-50 hover:bg-amber-100"
                                : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                            }`}
                          >
                            {isPublished ? "Unpublish" : "Publish"}
                          </button>

                          {/* Edit Button */}
                          <Link
                            href={`/admin/posts/${p.id}`}
                            className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            Edit
                          </Link>

                          {/* Delete Button */}
                          <button
                            onClick={() => setConfirm(p)}
                            className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {confirm && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <h3 className="font-display text-lg font-bold text-slate-900">
                Delete Article?
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Are you sure you want to permanently delete{" "}
                <span className="font-semibold text-slate-900">"{confirm.title}"</span>?
                This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => setConfirm(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
                  onClick={handleDelete}
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Toast Notification */}
        {toast && (
          <div
            role="status"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-2xl"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toast}</span>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
