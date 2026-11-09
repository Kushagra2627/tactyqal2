"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "@/lib/api";
import type { Category } from "@/lib/api";
import {
  PlusCircle,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  FolderTree,
  Save
} from "lucide-react";

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Add form
  const [addName, setAddName] = useState("");
  const [addSlug, setAddSlug] = useState("");
  const [addSlugManual, setAddSlugManual] = useState(false);
  const [adding, setAdding] = useState(false);

  // Edit state
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editing, setEditing] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const addInputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    getCategories()
      .then(setCategories)
      .catch(() => notify("Failed to load categories", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // Auto-slug for add form
  useEffect(() => {
    if (!addSlugManual) setAddSlug(slugify(addName));
  }, [addName, addSlugManual]);

  const notify = (msg: string, type: "success" | "error" = "success") => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(""), 3000);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) return;
    setAdding(true);
    try {
      await createCategory({ name: addName.trim(), slug: addSlug.trim() || slugify(addName) });
      setAddName("");
      setAddSlug("");
      setAddSlugManual(false);
      load();
      notify("Category created!");
      addInputRef.current?.focus();
    } catch (err: any) {
      notify(err?.message || "Failed to create category", "error");
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (cat: Category) => {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditSlug(cat.slug);
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    setEditing(true);
    try {
      await updateCategory(id, { name: editName.trim(), slug: editSlug.trim() || slugify(editName) });
      setEditId(null);
      load();
      notify("Category updated!");
    } catch (err: any) {
      notify(err?.message || "Failed to update category", "error");
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      load();
      notify("Category deleted.");
    } catch (err: any) {
      notify(err?.message || "Failed to delete category", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout title="Categories">
      <div className="max-w-2xl space-y-6">
        {/* Add Form */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-slate-800 flex items-center gap-2">
            <PlusCircle className="h-4 w-4 text-lagoon" />
            Add New Category
          </h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Name
              </label>
              <input
                ref={addInputRef}
                type="text"
                placeholder="e.g. Pitching"
                value={addName}
                onChange={(e) => { setAddName(e.target.value); setAddSlugManual(false); }}
                className="input w-full text-sm focus:border-lagoon"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Slug
              </label>
              <input
                type="text"
                value={addSlug}
                onChange={(e) => { setAddSlug(e.target.value); setAddSlugManual(true); }}
                className="input w-full font-mono text-xs focus:border-lagoon"
                placeholder="auto-generated"
              />
            </div>
            <button
              type="submit"
              disabled={adding || !addName.trim()}
              className="flex items-center gap-2 rounded-lg bg-lagoon px-4 py-2 text-sm font-semibold text-white hover:bg-lagoon-dark transition-all disabled:opacity-60"
            >
              {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
              {adding ? "Adding…" : "Add Category"}
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/75 px-5 py-3.5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <FolderTree className="h-3.5 w-3.5" />
              All Categories ({categories.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-lagoon" />
            </div>
          ) : categories.length === 0 ? (
            <div className="py-12 text-center">
              <FolderTree className="mx-auto h-8 w-8 text-slate-200" />
              <p className="mt-3 text-sm font-semibold text-slate-700">No categories yet</p>
              <p className="mt-1 text-xs text-slate-400">Add your first category above.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {categories.map((cat) =>
                editId === cat.id ? (
                  /* Inline Edit Row */
                  <li key={cat.id} className="bg-lagoon/5 px-5 py-4">
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                        className="input w-full text-sm font-semibold focus:border-lagoon"
                      />
                      <input
                        type="text"
                        value={editSlug}
                        onChange={(e) => setEditSlug(e.target.value)}
                        className="input w-full font-mono text-xs focus:border-lagoon"
                        placeholder="slug"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(cat.id)}
                          disabled={editing}
                          className="flex items-center gap-1.5 rounded-lg bg-lagoon px-3 py-1.5 text-xs font-semibold text-white hover:bg-lagoon-dark disabled:opacity-60"
                        >
                          {editing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                          Save
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          <X className="h-3.5 w-3.5" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  </li>
                ) : (
                  /* Normal Row */
                  <li key={cat.id} className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{cat.name}</p>
                      <p className="font-mono text-[11px] text-slate-400">{cat.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(cat)}
                        className="flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(cat)}
                        className="flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="font-display text-lg font-bold text-slate-900">Delete Category?</h3>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900">"{deleteTarget.name}"</span>?
              Posts in this category will be unaffected.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {deleting ? "Deleting…" : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-2xl ${
            toastType === "error" ? "bg-red-700" : "bg-slate-950"
          }`}
        >
          {toastType === "error" ? (
            <AlertCircle className="h-4 w-4 text-red-300" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          )}
          {toast}
        </div>
      )}
    </AdminLayout>
  );
}
