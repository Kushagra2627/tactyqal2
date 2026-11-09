import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { pool } from "../src/db/pool.js";
import { runMigrations } from "../src/db/migrate.js";
import { seed } from "../scripts/seed.js";
import { config } from "../src/config/env.js";

let adminCookie = "";

beforeAll(async () => {
  await runMigrations();
  await seed();
});

afterAll(async () => {
  await pool.end();
});

describe("Authentication & Security APIs", () => {
  it("should fail login with missing credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("should fail login with invalid password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: config.adminEmail,
      password: "WrongPassword999!"
    });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("should login successfully with valid credentials and set httpOnly cookie", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: config.adminEmail,
      password: config.adminPassword
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(config.adminEmail);
    // JWT token MUST NOT be exposed in JSON response
    expect(res.body.data.token).toBeUndefined();

    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    const cookieHeader = Array.isArray(cookies) ? cookies.join(";") : cookies;
    expect(cookieHeader).toContain(config.cookieName);
    expect(cookieHeader.toLowerCase()).toContain("httponly");

    adminCookie = cookieHeader;
  });

  it("should return current user via /api/auth/me when authenticated", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(config.adminEmail);
  });

  it("should reject /api/auth/me without authentication cookie", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("should reject /api/auth/me with invalid or forged cookie", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Cookie", `${config.cookieName}=invalid-fake-token;`);
    expect(res.status).toBe(401);
  });

  it("should logout successfully and clear cookie", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe("Public Blog APIs & Visibility Controls", () => {
  it("GET /api/posts returns published posts with pagination", async () => {
    const res = await request(app).get("/api/posts?page=1&pageSize=5");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.items).toBeInstanceOf(Array);
    expect(res.body.data.total).toBeGreaterThanOrEqual(1);

    // Verify all items are strictly published
    for (const post of res.body.data.items) {
      expect(post.status).toBe("published");
    }
  });

  it("GET /api/posts/:slug returns a published post", async () => {
    const res = await request(app).get(
      "/api/posts/elevator-pitch-with-examples-for-business-entrepreneurs"
    );
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe(
      "elevator-pitch-with-examples-for-business-entrepreneurs"
    );
  });

  it("GET /api/posts/:slug returns 404 for nonexistent post", async () => {
    const res = await request(app).get("/api/posts/non-existent-article-slug");
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("NOT_FOUND");
  });

  it("GET /api/categories returns category list", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Admin Post CRUD & Draft/Scheduled Restrictions", () => {
  let createdPostId = "";
  const testSlug = "test-automated-integration-post";

  it("should create a draft post via admin endpoint", async () => {
    const res = await request(app)
      .post("/api/admin/posts")
      .set("Cookie", adminCookie)
      .send({
        title: "Test Automated Integration Post",
        slug: testSlug,
        excerpt: "This is a test draft post created during integration tests.",
        body: "<p>This is the full body content of the test post.</p>",
        category: "Ideas",
        cover_url: "https://www.tactyqal.com/application/assets/images/blog-ele.png",
        status: "draft"
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe(testSlug);
    expect(res.body.data.status).toBe("draft");
    createdPostId = res.body.data.id;
  });

  it("should prevent duplicate slug creation", async () => {
    const res = await request(app)
      .post("/api/admin/posts")
      .set("Cookie", adminCookie)
      .send({
        title: "Another Post With Duplicate Slug",
        slug: testSlug,
        excerpt: "Duplicate slug test excerpt content.",
        body: "<p>Duplicate slug test body content.</p>",
        category: "Ideas",
        cover_url: "https://www.tactyqal.com/application/assets/images/blog-ele.png",
        status: "draft"
      });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("CONFLICT");
  });

  it("draft post MUST NOT be visible on public GET /api/posts", async () => {
    const res = await request(app).get("/api/posts");
    expect(res.status).toBe(200);
    const found = res.body.data.items.find((p: any) => p.id === createdPostId);
    expect(found).toBeUndefined();
  });

  it("draft post MUST NOT be accessible on public GET /api/posts/:slug", async () => {
    const res = await request(app).get(`/api/posts/${testSlug}`);
    expect(res.status).toBe(404);
  });

  it("should publish the draft post via status patch", async () => {
    const res = await request(app)
      .patch(`/api/admin/posts/${createdPostId}/status`)
      .set("Cookie", adminCookie)
      .send({ status: "published" });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("published");
  });

  it("published post MUST now be accessible on public GET /api/posts/:slug", async () => {
    const res = await request(app).get(`/api/posts/${testSlug}`);
    expect(res.status).toBe(200);
    expect(res.body.data.slug).toBe(testSlug);
  });

  it("should unpublish the post back to draft", async () => {
    const res = await request(app)
      .patch(`/api/admin/posts/${createdPostId}/status`)
      .set("Cookie", adminCookie)
      .send({ status: "draft" });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("draft");

    // Verify it is immediately hidden again from public
    const publicRes = await request(app).get(`/api/posts/${testSlug}`);
    expect(publicRes.status).toBe(404);
  });

  it("should update post details via PUT /api/admin/posts/:id", async () => {
    const res = await request(app)
      .put(`/api/admin/posts/${createdPostId}`)
      .set("Cookie", adminCookie)
      .send({
        title: "Updated Integration Post Title",
        excerpt: "Updated excerpt with minimum characters."
      });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe("Updated Integration Post Title");
  });

  it("should delete the post via DELETE /api/admin/posts/:id", async () => {
    const res = await request(app)
      .delete(`/api/admin/posts/${createdPostId}`)
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify it is gone from admin
    const checkRes = await request(app)
      .get(`/api/admin/posts/${createdPostId}`)
      .set("Cookie", adminCookie);
    expect(checkRes.status).toBe(404);
  });
});

describe("Contact Form & Newsletter APIs", () => {
  it("should reject contact submission with missing fields", async () => {
    const res = await request(app).post("/api/contact").send({
      name: "Leela"
    });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(res.body.error.fields).toHaveProperty("email");
  });

  it("should reject contact submission with invalid email", async () => {
    const res = await request(app).post("/api/contact").send({
      name: "John Doe",
      email: "not-an-email",
      subject: "Inquiry",
      message: "This is a legitimate message with more than 10 characters."
    });
    expect(res.status).toBe(422);
    expect(res.body.error.fields).toHaveProperty("email");
  });

  it("should accept valid contact submission matching frontend schema", async () => {
    const res = await request(app).post("/api/contact").send({
      name: "Jane Smith",
      email: "jane.smith@example.com",
      company: "Acme Ventures",
      subject: "Program Inquiry for Teen",
      message: "Hello Tactyqal team, I would like to enroll my 14-year-old."
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toBeDefined();
  });

  it("should accept newsletter subscription", async () => {
    const res = await request(app).post("/api/newsletter").send({
      email: "parent@example.com"
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should handle duplicate newsletter subscription gracefully", async () => {
    const res = await request(app).post("/api/newsletter").send({
      email: "parent@example.com"
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe("Admin Dashboard Statistics & Media APIs", () => {
  it("GET /api/admin/stats returns statistics with explicit demo label on views", async () => {
    const res = await request(app)
      .get("/api/admin/stats")
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("totalPosts");
    expect(res.body.data).toHaveProperty("publishedPosts");
    expect(res.body.data).toHaveProperty("draftPosts");
    expect(res.body.data).toHaveProperty("viewsPerDay");
    expect(res.body.data.viewsPerDay.isDemoData).toBe(true);
  });

  it("should reject non-image file uploads", async () => {
    const res = await request(app)
      .post("/api/admin/media")
      .set("Cookie", adminCookie)
      .attach("file", Buffer.from("plain text content"), "malicious.exe");

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("should upload a valid PNG image", async () => {
    // 1x1 transparent PNG buffer
    const pngBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      "base64"
    );

    const res = await request(app)
      .post("/api/admin/media")
      .set("Cookie", adminCookie)
      .attach("file", pngBuffer, "test-pixel.png");

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.filename).toBeDefined();
    expect(res.body.data.url).toContain("/uploads/");
  });
});
