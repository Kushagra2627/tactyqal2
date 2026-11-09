"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import { getMedia, uploadMedia, deleteMedia } from "@/lib/api";
import {
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Copy,
  Check,
  X
} from "lucide-react";

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  size?: number;
  mime_type?: string;
  created_at?: string;
}

function formatBytes(bytes: number) {
  if (!bytes || bytes === 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = (p = page) => {
    setLoading(true);
    getMedia(p, pageSize)
      .then((res) => {
        setItems(res.items || []);
        setTotal(res.total || 0);
      })
      .catch(() => notify("Failed to load media", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(page); }, [page]);

  const notify = (msg: string, type: "success" | "error" = "success") => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(""), 3500);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadProgress(0);
    let done = 0;
    const failed: string[] = [];
    for (const file of Array.from(files)) {
      try {
        await uploadMedia(file);
        done++;
        setUploadProgress(Math.round((done / files.length) * 100));
      } catch {
        failed.push(file.name);
      }
    }
    setUploading(false);
    setUploadProgress(0);
    load(1);
    setPage(1);
    if (failed.length) {
      notify(`${done} uploaded. ${failed.length} failed: ${failed.join(", ")}`, "error");
    } else {
      notify(`${done} file${done !== 1 ? "s" : ""} uploaded!`);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMedia(deleteTarget.id);
      setDeleteTarget(null);
      load(page);
      notify("File deleted.");
    } catch (err: any) {
      notify(err?.message || "Failed to delete file", "error");
    } finally {
      setDeleting(false);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(url);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const totalPages = Math.ceil(total / pageSize);

  const getBaseUrl = () => {
    if (typeof window !== "undefined") {
      return process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";
    }
    return "http://localhost:5000";
  };

  const resolveUrl = (url: string) => {
    if (url.startsWith("http")) return url;
    return `${getBaseUrl()}${url}`;
  };

  return (
    <AdminLayout
      title="Media Library"
      action={
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 rounded-lg bg-lagoon px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-lagoon-dark transition-all disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Upload Files
        </button>
      }
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="space-y-5">
        {/* Drag & Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 transition-all ${
            dragOver
              ? "border-lagoon bg-lagoon/5"
              : "border-slate-200 bg-white hover:border-lagoon/50 hover:bg-slate-50"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-lagoon" />
              <p className="text-sm font-semibold text-slate-700">Uploading… {uploadProgress}%</p>
              <div className="h-1.5 w-48 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-lagoon transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lagoon/10">
                <Upload className="h-6 w-6 text-lagoon" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-700">
                  Drop images here or{" "}
                  <span className="text-lagoon">click to upload</span>
                </p>
                <p className="mt-1 text-xs text-slate-400">PNG, JPG, GIF, WebP up to 10MB each</p>
              </div>
            </>
          )}
        </div>

        {/* Stats bar */}
        {total > 0 && (
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
            <p className="text-xs text-slate-500">
              <span className="font-semibold text-slate-800">{total}</span> file{total !== 1 ? "s" : ""} ·{" "}
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Media Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-7 w-7 animate-spin text-lagoon" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-20 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
              <ImageIcon className="h-8 w-8 text-slate-200" />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-700">No media files yet</p>
            <p className="mt-1 text-xs text-slate-400">Upload your first image using the button above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {items.map((item) => {
              const url = resolveUrl(item.url);
              const isCopied = copied === item.url;
              return (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-square bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={item.filename}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const icon = document.createElement("div");
                          icon.className = "flex h-full w-full items-center justify-center text-slate-200";
                          icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>`;
                          parent.appendChild(icon);
                        }
                      }}
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => copyUrl(item.url)}
                        title="Copy URL"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                      >
                        {isCopied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        title="Delete"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/80 text-white hover:bg-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* File info */}
                  <div className="p-2">
                    <p className="truncate text-[11px] font-medium text-slate-700" title={item.filename}>
                      {item.filename}
                    </p>
                    {item.size && (
                      <p className="text-[10px] text-slate-400">{formatBytes(item.size)}</p>
                    )}
                  </div>
                </div>
              );
            })}
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
            <h3 className="font-display text-lg font-bold text-slate-900">Delete File?</h3>
            <p className="mt-2 text-sm text-slate-600">
              Permanently delete{" "}
              <span className="font-semibold text-slate-900">"{deleteTarget.filename}"</span>?
              This cannot be undone.
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
