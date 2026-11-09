import { pool } from "../db/pool.js";

export async function getDashboardStats() {
  const postsCountRes = await pool.query(`
    SELECT
      COUNT(id)::int as total,
      COUNT(id) FILTER (WHERE status = 'published')::int as published,
      COUNT(id) FILTER (WHERE status = 'draft')::int as draft,
      COUNT(id) FILTER (WHERE status = 'scheduled')::int as scheduled
    FROM posts
  `);

  const categoriesCountRes = await pool.query(`
    SELECT COUNT(id)::int as total FROM categories
  `);

  const recentPostsRes = await pool.query(`
    SELECT id, slug, title, status, published_at, created_at
    FROM posts
    ORDER BY created_at DESC
    LIMIT 5
  `);

  // Views per day: Demonstration data as required by specification
  const demoViewsPerDay = [
    { date: "2026-11-01", views: 245, isDemo: true },
    { date: "2026-11-02", views: 312, isDemo: true },
    { date: "2026-11-03", views: 289, isDemo: true },
    { date: "2026-11-04", views: 405, isDemo: true },
    { date: "2026-11-05", views: 520, isDemo: true },
    { date: "2026-11-06", views: 490, isDemo: true },
    { date: "2026-11-07", views: 610, isDemo: true }
  ];

  const postCounts = postsCountRes.rows[0] || { total: 0, published: 0, draft: 0, scheduled: 0 };

  return {
    totalPosts: postCounts.total,
    publishedPosts: postCounts.published,
    draftPosts: postCounts.draft,
    scheduledPosts: postCounts.scheduled,
    totalCategories: categoriesCountRes.rows[0]?.total || 0,
    recentPosts: recentPostsRes.rows,
    viewsPerDay: {
      isDemoData: true,
      label: "Demonstration Data (Analytics Not Connected)",
      data: demoViewsPerDay
    }
  };
}
