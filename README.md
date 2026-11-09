# Tactyqal Labs — Full-Stack Website & Admin Platform

This repository contains the complete full-stack web application for Tactyqal Labs, comprising the Next.js 14 App Router frontend and an Express.js / TypeScript / PostgreSQL REST API backend.

---

## 1. Directory Structure

```text
tactyqal-project/
│
├── tactyqal/                 # Existing Next.js 14 App Router frontend
│   ├── src/
│   │   ├── app/              # Routes: /, /blog, /blog/[slug], /admin/login, /admin/posts
│   │   ├── components/       # BlogList, ContactForm, Timeline
│   │   └── lib/              # api.ts (backend client & mock fallback), data.ts
│   ├── .env.example
│   └── package.json
│
├── backend/                  # Production Express.js TypeScript backend
│   ├── src/
│   │   ├── config/           # Environment & configuration loading
│   │   ├── controllers/      # Auth, Posts, Categories, Tags, Contact, Newsletter, Stats, Media
│   │   ├── db/               # PostgreSQL pool, migrate runner, SQL migrations
│   │   ├── middleware/       # Auth guards, rate limiting, caching, error handling
│   │   ├── routes/           # REST endpoints mounted on /api
│   │   ├── services/         # Parameterized SQL queries and business logic
│   │   ├── utils/            # Error classes, HTML sanitizer
│   │   └── validators/       # Zod schemas matching frontend contracts
│   ├── scripts/              # Seed script (canonical 6 posts, categories, admin user)
│   ├── tests/                # Vitest & Supertest integration tests
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml        # Orchestration for PostgreSQL, Backend, and Frontend
├── README.md
└── .gitignore
```

---

## 2. Prerequisites

- **Node.js**: v20.x or higher
- **npm**: v10.x or higher
- **PostgreSQL**: v16+ (or Docker / Docker Compose)

---

## 3. Quickstart with Docker Compose

To start the database, backend, and frontend together:

```bash
docker-compose up --build
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **PostgreSQL**: localhost:5432

---

## 4. Manual Local Development Setup

### Step 1: Database Setup
Ensure PostgreSQL is running locally on port 5432. Create the database:
```bash
psql -U postgres -c "CREATE DATABASE tactyqal_db;"
```

### Step 2: Backend Setup
```bash
cd backend
npm install
cp .env.example .env

# Run SQL migrations
npm run migrate

# Seed canonical posts and admin account
npm run seed

# Run integration tests
npm test

# Start backend development server
npm run dev
```
Backend API will be available at `http://localhost:5000/api`.

### Step 3: Frontend Setup
Open a second terminal window:
```bash
cd tactyqal
npm install
cp .env.example .env.local

# Run Next.js production build check
npm run build

# Start frontend development server
npm run dev
```
Frontend will be available at `http://localhost:3000`.

---

## 5. Mock Mode vs. Real Backend

You can toggle between the real Express API and the built-in offline mock:

In `tactyqal/.env.local`:
```env
# Set to "false" to connect to the Express REST API
NEXT_PUBLIC_USE_MOCK=false

# Set to "true" to run with deterministic in-memory client mock
NEXT_PUBLIC_USE_MOCK=true
```

When `NEXT_PUBLIC_USE_MOCK=false`, the frontend makes direct HTTP calls to the Express backend without silent mock fallbacks. If an endpoint fails, clear error messages are surfaced to the user.

---

## 6. Seeded Admin Credentials

The seed script creates the default administrator account:

- **Email**: `admin@tactyqal.com`
- **Password**: `AdminPassword123!`
- **Role**: `admin`

Sign in at: `http://localhost:3000/admin/login`.

---

## 7. Testing

### Run Backend Integration Tests
```bash
cd backend
npm test
```
The Vitest test suite executes 28 integration tests covering:
- Authentication, secure cookie handling, logout, unauthorized rejection
- Public blog post retrieval and visibility restrictions
- Admin post creation, updating, deletion, and duplicate slug handling
- Immediate hiding of draft articles from public routes
- Contact form validation and message persistence
- Newsletter subscriptions and duplicate handling
- Admin statistics with demo labeling
- Image file upload validation and non-image rejection

### Run Frontend Typecheck & Build
```bash
cd tactyqal
npx tsc --noEmit
npm run build
```

---

## 8. Deployment Guide

### A. Managed PostgreSQL
1. Create a managed PostgreSQL database on Neon, Supabase, or AWS RDS.
2. Note your connection string: `postgresql://user:password@host:port/dbname?sslmode=require`.

### B. Backend Deployment on Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your Git repository and set Root Directory to `backend`.
3. Set Build Command: `npm install && npm run build`.
4. Set Start Command: `npm run migrate && npm run seed && npm start`.
5. Add Environment Variables:
   - `DATABASE_URL`: Your managed PostgreSQL connection string
   - `JWT_SECRET`: Secure 32+ character random string
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: Your frontend URL (e.g. `https://tactyqal.vercel.app`)
   - `ADMIN_EMAIL`: `admin@tactyqal.com`
   - `ADMIN_PASSWORD`: Strong password

### C. Frontend Deployment on Vercel
1. Import your Git repository into [Vercel](https://vercel.com).
2. Set Root Directory to `tactyqal`.
3. Framework Preset: Next.js.
4. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your deployed Render API URL + `/api` (e.g. `https://tactyqal-api.onrender.com/api`)
   - `NEXT_PUBLIC_USE_MOCK`: `false`
5. Deploy.
