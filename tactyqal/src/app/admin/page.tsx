"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import { getStats } from "@/lib/api";
import {
  FileText,
  CheckCircle2,
  FileEdit,
  FolderTree,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load dashboard stats", err);
        setLoading(false);
      });
  }, []);

  const statCards = [
    {
      label: "Total Articles",
      value: stats?.totalPosts ?? 0,
      icon: FileText,
      color: "text-blue-600 bg-blue-50"
    },
    {
      label: "Published",
      value: stats?.publishedPosts ?? 0,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      label: "Drafts",
      value: stats?.draftPosts ?? 0,
      icon: FileEdit,
      color: "text-amber-600 bg-amber-50"
    },
    {
      label: "Categories",
      value: stats?.totalCategories ?? 0,
      icon: FolderTree,
      color: "text-purple-600 bg-purple-50"
    }
  ];

  return (
    <AdminLayout
      title="Dashboard Overview"
      action={
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-lagoon px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-lagoon-dark transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          Create Post
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {card.label}
                  </span>
                  <span className={`rounded-lg p-2 ${card.color}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <div className="mt-3">
                  <span className="font-display text-3xl font-extrabold text-slate-900">
                    {loading ? "..." : card.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Analytics Chart Container */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-lagoon" />
                <h3 className="font-display text-base font-bold text-slate-900">
                  Article Views (Last 7 Days)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Daily traffic trajectory across published articles.
              </p>
            </div>

            {/* Explicit Demo Label */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Demonstration Data • Analytics Tracking Not Connected</span>
            </div>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="mt-6">
            <div className="h-48 w-full flex items-end gap-3 sm:gap-6 pt-6">
              {(stats?.viewsPerDay?.data || [
                { date: "11/01", views: 245 },
                { date: "11/02", views: 312 },
                { date: "11/03", views: 289 },
                { date: "11/04", views: 405 },
                { date: "11/05", views: 520 },
                { date: "11/06", views: 490 },
                { date: "11/07", views: 610 }
              ]).map((point: any) => {
                const heightPct = Math.round((point.views / 700) * 100);
                return (
                  <div key={point.date} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-600">
                      {point.views}
                    </span>
                    <div className="w-full rounded-t-md bg-lagoon/20 hover:bg-lagoon transition-all relative group h-32 flex items-end">
                      <div
                        className="w-full rounded-t-md bg-lagoon transition-all duration-500"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-slate-400">
                      {point.date.slice(-5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Articles */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-display text-base font-bold text-slate-900">
              Recent Articles
            </h3>
            <Link
              href="/admin/posts"
              className="inline-flex items-center gap-1 text-xs font-semibold text-lagoon hover:text-lagoon-dark"
            >
              <span>View all</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {(stats?.recentPosts || []).map((post: any) => (
              <div
                key={post.id}
                className="flex items-center justify-between py-3.5 text-sm"
              >
                <div>
                  <p className="font-semibold text-slate-900 hover:text-lagoon">
                    {post.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {post.published_at ? new Date(post.published_at).toISOString().split("T")[0] : "Draft"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      post.status === "published"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {post.status}
                  </span>
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="text-xs font-medium text-slate-500 hover:text-slate-900 underline"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
