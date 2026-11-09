import bcrypt from "bcryptjs";
import { pool } from "../src/db/pool.js";
import { config } from "../src/config/env.js";

const img = (f: string) => `https://www.tactyqal.com/application/assets/images/${f}`;
const demoBody = "DEMO BODY: the full article text was not imported. Replace with content from the WordPress export.";

const seedPosts = [
  {
    slug: "elevator-pitch-with-examples-for-business-entrepreneurs",
    title: "The elevator pitch for business entrepreneurs",
    excerpt: "An elevator pitch is the fastest way to describe what your startup...",
    category: "Pitching",
    date: "2024-05-01",
    read: 3,
    cover: img("blog-ele.png"),
    status: "published",
    body: demoBody
  },
  {
    slug: "how-to-build-a-tech-startup-team-2",
    title: "How to build a tech startup team?",
    excerpt: "In the early days, the fewer employees, the better. Managing people takes up a lot of time...",
    category: "Teams",
    date: "2024-04-20",
    read: 4,
    cover: img("blog-startup.png"),
    status: "published",
    body: demoBody
  },
  {
    slug: "11-reasons-why-startups-fail-at-idea-stage",
    title: "11 reasons why startups fail at the idea stage",
    excerpt: "The default state of a startup is failure and there are many...",
    category: "Ideas",
    date: "2024-04-10",
    read: 3,
    cover: img("blog-fail.png"),
    status: "published",
    body: demoBody
  },
  {
    slug: "50-no-code-startup-ideas-to-build-without-programming-skills",
    title: "50 No-code startup app ideas",
    excerpt: "Find a list of 50 unique ideas you can explore for your startup...",
    category: "Ideas",
    date: "2025-07-09",
    read: 5,
    cover: img("50-No-Code-Startup-Ideas-You-Can-Build-Without-Programming-Skills.webp"),
    status: "published",
    body: demoBody
  },
  {
    slug: "30-startup-ideas-for-solving-food-waste-problems",
    title: "30 Startup ideas to solve food waste problems",
    excerpt: "Food waste is a massive problem. Every year, we throw away one-third of all food...",
    category: "Ideas",
    date: "2024-03-15",
    read: 4,
    cover: img("30-startup-ideas-for-food-waste-problems.jpg"),
    status: "published",
    body: demoBody
  },
  {
    slug: "50-startup-ideas-for-generation-z-entrepreneurs",
    title: "50 Startup ideas for Gen-Z Entrepreneurs",
    excerpt: "Looking at the opportunities ahead, Generation Z entrepreneurs has advantages..",
    category: "Ideas",
    date: "2024-03-05",
    read: 6,
    cover: img("50-Startup-Ideas-for-Generation-Z-Entrepreneurs.jpg"),
    status: "published",
    body: demoBody
  }
];

export async function seed() {
  const client = await pool.connect();
  try {
    console.log("Seeding database...");

    // 1. Seed or update Admin User
    const existingUser = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [config.adminEmail]
    );

    let adminId: string;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(config.adminPassword, salt);

    if (existingUser.rows.length === 0) {
      const res = await client.query(
        `INSERT INTO users (email, password_hash, name, role)
         VALUES ($1, $2, $3, 'admin')
         RETURNING id`,
        [config.adminEmail, passwordHash, config.adminName]
      );
      adminId = res.rows[0].id;
      console.log(`Created admin user: ${config.adminEmail}`);
    } else {
      adminId = existingUser.rows[0].id;
      await client.query(
        `UPDATE users SET password_hash = $1, name = $2 WHERE id = $3`,
        [passwordHash, config.adminName, adminId]
      );
      console.log(`Updated admin user: ${config.adminEmail}`);
    }

    // 2. Seed Categories
    const categoryMap = new Map<string, string>();
    const uniqueCategories = Array.from(new Set(seedPosts.map((p) => p.category)));

    for (const catName of uniqueCategories) {
      const catSlug = catName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const existing = await client.query(
        "SELECT id FROM categories WHERE slug = $1",
        [catSlug]
      );
      if (existing.rows.length === 0) {
        const catRes = await client.query(
          "INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING id",
          [catName, catSlug]
        );
        categoryMap.set(catName, catRes.rows[0].id);
        console.log(`Created category: ${catName} (${catSlug})`);
      } else {
        categoryMap.set(catName, existing.rows[0].id);
      }
    }

    // 3. Seed Posts
    for (const post of seedPosts) {
      const categoryId = categoryMap.get(post.category) || null;
      const existing = await client.query(
        "SELECT id FROM posts WHERE slug = $1",
        [post.slug]
      );

      const publishedAt = new Date(post.date).toISOString();

      if (existing.rows.length === 0) {
        await client.query(
          `INSERT INTO posts (
            slug, title, excerpt, body, category_id, cover_url,
            status, published_at, read_minutes, author_id,
            seo_title, seo_description
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [
            post.slug,
            post.title,
            post.excerpt,
            post.body,
            categoryId,
            post.cover,
            post.status,
            publishedAt,
            post.read,
            adminId,
            post.title,
            post.excerpt
          ]
        );
        console.log(`Seeded post: ${post.title}`);
      } else {
        console.log(`Post already exists: ${post.title}`);
      }
    }

    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Seeding error:", err);
    throw err;
  } finally {
    client.release();
  }
}

if (process.argv[1] && process.argv[1].endsWith("seed.ts")) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
