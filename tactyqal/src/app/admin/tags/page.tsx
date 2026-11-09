"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import { getTags, createTag, updateTag, deleteTag } from "@/lib/api";
import type { Tag } from "@/lib/api";
import {
  PlusCircle,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Tags as TagsIcon,
  Save
} from "lucide-react";

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
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
  const [deleteTarget, setDeleteTarget] = useState<Tag | null>(null);
  const [deleting, setDeleting] = useState(false);

  const addInputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    getTags()
      .then(setTags)
      .catch(() => notify("Failed to load tags", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

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
      await createTag({ name: addName.trim(), slug: addSlug.trim() || slugify(addName) });
      setAddName("");
      setAddSlug("");
      setAddSlugManual(false);
      load();
      notify("Tag created!");
      addInputRef.current?.focus();
    } catch (err: any) {
      notify(err?.message || "Failed to create tag", "error");
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (tag: Tag) => {
    setEditId(tag.id);
    setEditName(tag.name);
    setEditSlug(tag.slug);
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    setEditing(true);
    try {
      await updateTag(id, { name: editName.trim(), slug: editSlug.trim() || slugify(editName) });
      setEditId(null);
      load();
      notify("Tag updated!");
    } catch (err: any) {
      notify(err?.message || "Failed to update tag", "error");
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTag(deleteTarget.id);
      setDeleteTarget(null);
      load();
      notify("Tag deleted.");
    } catch (err: any) {
      notify(err?.message || "Failed to delete tag", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout title="Tags">
      <div className="max-w-2xl space-y-6">
        {/* Add Form */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-slate-800 flex items-center gap-2">
            <PlusCircle className="h-4 w-4 text-lagoon" />
            Add New Tag
          </h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Name
              </label>
              <input
                ref={addInputRef}
                type="text"
                placeholder="e.g. Startups"
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
              {adding ? "Adding…" : "Add Tag"}
            </button>
          </form>
        </div>

        {/* Tags List */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/75 px-5 py-3.5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <TagsIcon className="h-3.5 w-3.5" />
              All Tags ({tags.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-lagoon" />
            </div>
          ) : tags.length === 0 ? (
            <div className="py-12 text-center">
              <TagsIcon className="mx-auto h-8 w-8 text-slate-200" />
              <p className="mt-3 text-sm font-semibold text-slate-700">No tags yet</p>
              <p className="mt-1 text-xs text-slate-400">Add your first tag above.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {tags.map((tag) =>
                editId === tag.id ? (
                  <li key={tag.id} className="bg-lagoon/5 px-5 py-4">
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
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(tag.id)}
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
                  <li key={tag.id} className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="inline-block h-2 w-2 rounded-full bg-lagoon/50" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{tag.name}</p>
                        <p className="font-mono text-[11px] text-slate-400">{tag.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(tag)}
                        className="flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(tag)}
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

        {/* Tag cloud preview */}
        {tags.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Tag Cloud Preview</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-lagoon/10 px-3 py-1 text-xs font-medium text-lagoon"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="font-display text-lg font-bold text-slate-900">Delete Tag?</h3>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900">"{deleteTarget.name}"</span>?
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
