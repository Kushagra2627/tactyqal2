# Tactyqal Labs — Express.js REST API Backend

A production-grade, modular Node.js/Express REST API backend designed for Tactyqal Labs. Built with TypeScript, PostgreSQL, and strict security and validation practices.

---

## 1. Tech Stack

- **Runtime**: Node.js v20+ with TypeScript (ES2022 / NodeNext)
- **Framework**: Express.js 4.x
- **Database**: PostgreSQL 16+ using `pg` (node-postgres connection pool)
- **Validation**: Zod (strict validation for body, queries, and params)
- **Authentication**: JWT signed session tokens stored in secure, `httpOnly`, `SameSite=Lax` cookies
- **Password Hashing**: `bcryptjs` (salt rounds: 10)
- **Security**: Helmet, CORS with credentials, express-rate-limit, sanitize-html
- **File Uploads**: Multer (in-memory buffer + storage provider abstraction)
- **Testing**: Vitest + Supertest

---

## 2. Project Architecture

```text
backend/
├── src/
│   ├── app.ts                 # Express app setup, security headers, middleware
│   ├── server.ts              # HTTP server & graceful shutdown lifecycle
│   ├── config/
│   │   └── env.ts             # Strongly-typed environment configuration
│   ├── controllers/           # HTTP controllers for all domain routes
│   │   ├── auth.controller.ts
│   │   ├── post.controller.ts
│   │   ├── adminPost.controller.ts
│   │   ├── category.controller.ts
│   │   ├── tag.controller.ts
│   │   ├── contact.controller.ts
│   │   ├── newsletter.controller.ts
│   │   ├── stats.controller.ts
│   │   └── media.controller.ts
│   ├── db/
│   │   ├── pool.ts            # PostgreSQL pool configuration
│   │   ├── migrate.ts         # Migration runner with tracking table
│   │   └── migrations/        # Raw SQL migration files
│   ├── middleware/
│   │   ├── auth.ts            # requireAuth & requireRole middleware
│   │   ├── cache.ts           # HTTP Cache-Control header helpers
│   │   ├── errorHandler.ts    # Centralized standard error response formatter
│   │   └── rateLimit.ts       # Rate limiters (auth, contact, newsletter, general)
│   ├── routes/                # Modular Express routers
│   ├── services/              # Business logic & SQL parameterized database queries
│   ├── utils/
│   │   ├── errors.ts          # Custom domain Error classes
│   │   └── sanitize.ts        # sanitize-html XSS sanitizer
│   └── validators/            # Zod validation schemas
├── scripts/
│   └── seed.ts                # Database seed script for canonical posts & admin
├── tests/
│   └── api.test.ts            # Comprehensive Vitest/Supertest integration test suite
├── uploads/                   # Local file upload directory (gitignored)
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

## 3. Database Schema

All migrations are raw SQL located in `src/db/migrations/`:

1. **`users`**: UUID primary key, unique email, password hash, name, role (`admin` or `editor`), created_at.
2. **`categories`**: UUID primary key, name, unique slug, created_at.
3. **`tags`**: UUID primary key, name, unique slug, created_at.
4. **`posts`**: UUID primary key, unique slug, title, excerpt, sanitized HTML body, category_id FK, cover_url, status (`published`, `draft`, `scheduled`), published_at, read_minutes, author_id FK, seo_title, seo_description, og_image_url, created_at, updated_at.
5. **`post_tags`**: Composite primary key `(post_id, tag_id)` with cascading deletes.
6. **`media`**: UUID primary key, filename, url, mime, size_bytes, dimensions, created_at.
7. **`contact_messages`**: UUID primary key, name, email, company, subject, message, created_at.
8. **`newsletter_subscribers`**: UUID primary key, unique email, created_at.

Indexes are created for `posts(slug)`, `posts(status)`, `posts(published_at)`, `posts(category_id)`, `users(email)`, `categories(slug)`, and `tags(slug)`.

---

## 4. API Specification

All responses adhere to the standard JSON envelopes:

### Success Envelope
```json
{
  "success": true,
  "data": {}
}
```

### Error Envelope
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload",
    "fields": {
      "email": "Please provide a valid email address"
    }
  }
}
```

### Public Endpoints
- `GET /api/posts`: Query parameters `page`, `pageSize`, `search`, `category`. Only returns published posts where `published_at <= NOW()`.
- `GET /api/posts/:slug`: Returns single published post or 404.
- `GET /api/categories`: Returns all categories.
- `POST /api/contact`: Submits contact message with validation and rate limiting.
- `POST /api/newsletter`: Subscribes email address to newsletter.

### Authentication Endpoints
- `POST /api/auth/login`: Accepts `{ email, password }`. Sets secure `httpOnly` cookie (`tactyqal_token`). Tokens are never returned in JSON.
- `POST /api/auth/logout`: Clears authentication cookie.
- `GET /api/auth/me`: Returns currently authenticated user context.

### Admin Endpoints (Require `requireAuth` + `requireRole('admin')`)
- `GET /api/admin/posts`: Lists all posts with search, status filter, and pagination.
- `GET /api/admin/posts/:id`: Returns single post.
- `POST /api/admin/posts`: Creates a new draft or published post.
- `PUT /api/admin/posts/:id`: Updates an existing post.
- `PATCH /api/admin/posts/:id/status`: Updates or toggles post status.
- `DELETE /api/admin/posts/:id`: Deletes post and cascades tag associations.
- `GET /api/admin/categories`, `POST`, `PUT`, `DELETE`: Full category management.
- `GET /api/admin/tags`, `POST`, `PUT`, `DELETE`: Full tag management.
- `GET /api/admin/stats`: Dashboard summary counts and demonstration views-per-day dataset.
- `POST /api/admin/media`: Uploads image files (JPG, PNG, WEBP, GIF, SVG up to 5MB).
- `GET /api/admin/media`: Lists uploaded media files.
- `DELETE /api/admin/media/:id`: Deletes media file from storage and database.

---

## 5. Local Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `DATABASE_URL` points to your running PostgreSQL instance.

### 3. Run Database Migrations
```bash
npm run migrate
```

### 4. Seed Canonical Data & Admin User
```bash
npm run seed
```
Creates default admin: `admin@tactyqal.com` / `AdminPassword123!`.

### 5. Run Integration Tests
```bash
npm test
```

### 6. Start the API Server
```bash
# Development (with watch mode)
npm run dev

# Production
npm run build
npm start
```
Server runs at `http://localhost:5000`.

---

## 6. Known Security Considerations & Production Roadmap

- **CSRF Protection**: For cross-site frontend deployments on different top-level domains, implement double-submit cookie pattern or CSRF tokens. Currently protected via `SameSite=Lax` cookie policy.
- **Refresh Tokens & Session Revocation**: Current session tokens expire after 7 days. In large enterprise production, integrate a Redis-backed token revocation list or refresh token rotation.
- **Password Reset**: Implement time-limited cryptographically secure password reset tokens sent via transactional email (SendGrid/Resend).
- **Object Storage**: The current storage implementation uses `LocalDiskStorageProvider`. For multi-server cloud deployment, swap with S3/Cloudinary via the existing `StorageProvider` abstraction.
