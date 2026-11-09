import { seedPosts, type Post } from "./data";

export type { Post };

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string | null;
}

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // If running in browser, relative fallback or localhost:5000
  if (typeof window !== "undefined") {
    return "http://localhost:5000/api";
  }
  // SSR fallback
  return "http://127.0.0.1:5000/api";
}

// In-memory mock store for mock mode
let mockPosts: Post[] = [...seedPosts];
let mockCategories: Category[] = [
  { id: "c1", name: "Pitching", slug: "pitching" },
  { id: "c2", name: "Teams", slug: "teams" },
  { id: "c3", name: "Ideas", slug: "ideas" }
];
let mockTags: Tag[] = [
  { id: "t1", name: "Startups", slug: "startups" },
  { id: "t2", name: "No-Code", slug: "no-code" }
];
let mockMedia: any[] = [];
let mockCurrentUser: User | null = null;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include"
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMsg =
      json?.error?.message ||
      json?.message ||
      `Request failed with status ${res.status}`;
    const err = new Error(errorMsg);
    (err as any).status = res.status;
    (err as any).fields = json?.error?.fields;
    throw err;
  }

  return (json?.data !== undefined ? json.data : json) as T;
}

/**
 * List all posts
 * Adapt to preserve existing return type: Promise<Post[]>
 */
export const listPosts = async (): Promise<Post[]> => {
  if (USE_MOCK) {
    return [...mockPosts];
  }

  // Attempt admin endpoint first if authenticated, otherwise public
  try {
    const res = await request<{ items: Post[]; total: number }>("/admin/posts?pageSize=100");
    if (res && Array.isArray(res.items)) {
      return res.items;
    }
  } catch (err: any) {
    // If not authenticated or forbidden, fallback to public posts endpoint
    if (err.status === 401 || err.status === 403) {
      const publicRes = await request<{ items: Post[]; total: number }>("/posts?pageSize=100");
      return publicRes.items || [];
    }
    throw err;
  }

  const fallback = await request<{ items: Post[]; total: number }>("/posts?pageSize=100");
  return fallback.items || [];
};

/**
 * Get individual article by slug
 * Returns Post or null
 */
export const getPost = async (slug: string): Promise<Post | null> => {
  if (USE_MOCK) {
    return mockPosts.find((p) => p.slug === slug) ?? null;
  }

  try {
    const post = await request<Post>(`/posts/${encodeURIComponent(slug)}`);
    return post ?? null;
  } catch (err: any) {
    if (err.status === 404) {
      return null;
    }
    throw err;
  }
};

/**
 * Delete post by ID
 */
export const deletePost = async (id: string): Promise<void> => {
  if (USE_MOCK) {
    mockPosts = mockPosts.filter((p) => p.id !== id);
    return;
  }

  await request(`/admin/posts/${id}`, {
    method: "DELETE"
  });
};

/**
 * Toggle post status between published and draft
 */
export const toggleStatus = async (id: string): Promise<void> => {
  if (USE_MOCK) {
    mockPosts = mockPosts.map((p) =>
      p.id === id
        ? { ...p, status: p.status === "published" ? "draft" : "published" }
        : p
    );
    return;
  }

  await request(`/admin/posts/${id}/status`, {
    method: "PATCH"
  });
};

/**
 * Create a new post
 */
export const createPost = async (data: Partial<Post>): Promise<Post> => {
  if (USE_MOCK) {
    const newPost: Post = {
      id: String(mockPosts.length + 1),
      slug: data.slug || `post-${Date.now()}`,
      title: data.title || "Untitled",
      excerpt: data.excerpt || "",
      category: data.category || "General",
      date: data.date || new Date().toISOString().split("T")[0],
      read: data.read || 3,
      cover: data.cover || "https://www.tactyqal.com/application/assets/images/blog-ele.png",
      status: (data.status as "published" | "draft") || "draft",
      body: data.body || ""
    };
    mockPosts.unshift(newPost);
    return newPost;
  }

  return request<Post>("/admin/posts", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

/**
 * Update an existing post
 */
export const updatePost = async (id: string, data: Partial<Post>): Promise<Post> => {
  if (USE_MOCK) {
    let updated: Post | null = null;
    mockPosts = mockPosts.map((p) => {
      if (p.id === id) {
        updated = { ...p, ...data } as Post;
        return updated;
      }
      return p;
    });
    if (!updated) throw new Error("Post not found");
    return updated;
  }

  return request<Post>(`/admin/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
};

/**
 * Categories API
 */
export const getCategories = async (): Promise<Category[]> => {
  if (USE_MOCK) return [...mockCategories];
  return request<Category[]>("/categories");
};

export const createCategory = async (data: { name: string; slug?: string }): Promise<Category> => {
  if (USE_MOCK) {
    const cat: Category = { id: `c${mockCategories.length + 1}`, name: data.name, slug: data.slug || data.name.toLowerCase() };
    mockCategories.push(cat);
    return cat;
  }
  return request<Category>("/admin/categories", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

export const updateCategory = async (id: string, data: { name?: string; slug?: string }): Promise<Category> => {
  if (USE_MOCK) {
    mockCategories = mockCategories.map((c) => (c.id === id ? { ...c, ...data } : c));
    return mockCategories.find((c) => c.id === id)!;
  }
  return request<Category>(`/admin/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
};

export const deleteCategory = async (id: string): Promise<any> => {
  if (USE_MOCK) {
    mockCategories = mockCategories.filter((c) => c.id !== id);
    return { id };
  }
  return request(`/admin/categories/${id}`, { method: "DELETE" });
};

/**
 * Tags API
 */
export const getTags = async (): Promise<Tag[]> => {
  if (USE_MOCK) return [...mockTags];
  return request<Tag[]>("/admin/tags");
};

export const createTag = async (data: { name: string; slug?: string }): Promise<Tag> => {
  if (USE_MOCK) {
    const tag: Tag = { id: `t${mockTags.length + 1}`, name: data.name, slug: data.slug || data.name.toLowerCase() };
    mockTags.push(tag);
    return tag;
  }
  return request<Tag>("/admin/tags", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

export const updateTag = async (id: string, data: { name?: string; slug?: string }): Promise<Tag> => {
  if (USE_MOCK) {
    mockTags = mockTags.map((t) => (t.id === id ? { ...t, ...data } : t));
    return mockTags.find((t) => t.id === id)!;
  }
  return request<Tag>(`/admin/tags/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
};

export const deleteTag = async (id: string): Promise<any> => {
  if (USE_MOCK) {
    mockTags = mockTags.filter((t) => t.id !== id);
    return { id };
  }
  return request(`/admin/tags/${id}`, { method: "DELETE" });
};

/**
 * Dashboard Statistics
 */
export const getStats = async (): Promise<any> => {
  if (USE_MOCK) {
    return {
      totalPosts: mockPosts.length,
      publishedPosts: mockPosts.filter((p) => p.status === "published").length,
      draftPosts: mockPosts.filter((p) => p.status === "draft").length,
      scheduledPosts: 0,
      totalCategories: mockCategories.length,
      recentPosts: mockPosts.slice(0, 5),
      viewsPerDay: { isDemoData: true, label: "Demo Views", data: [] }
    };
  }
  return request("/admin/stats");
};

/**
 * Media Management
 */
export const uploadMedia = async (file: File): Promise<any> => {
  if (USE_MOCK) {
    const item = { id: `m${mockMedia.length + 1}`, filename: file.name, url: URL.createObjectURL(file) };
    mockMedia.push(item);
    return item;
  }
  const formData = new FormData();
  formData.append("file", file);
  return request("/admin/media", {
    method: "POST",
    body: formData
  });
};

export const getMedia = async (page = 1, pageSize = 20): Promise<any> => {
  if (USE_MOCK) return { items: mockMedia, total: mockMedia.length, page, pageSize };
  return request(`/admin/media?page=${page}&pageSize=${pageSize}`);
};

export const deleteMedia = async (id: string): Promise<any> => {
  if (USE_MOCK) {
    mockMedia = mockMedia.filter((m) => m.id !== id);
    return { id };
  }
  return request(`/admin/media/${id}`, { method: "DELETE" });
};

/**
 * Contact Submission
 */
export const submitContact = async (data: ContactData): Promise<any> => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    return { message: "Message sent in mock mode" };
  }
  return request("/contact", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

/**
 * Newsletter Subscription
 */
export const subscribeNewsletter = async (email: string): Promise<any> => {
  if (USE_MOCK) {
    return { message: "Subscribed in mock mode", email };
  }
  return request("/newsletter", {
    method: "POST",
    body: JSON.stringify({ email })
  });
};

/**
 * Authentication APIs
 */
export const login = async (credentials: { email: string; password: string }): Promise<{ user: User }> => {
  if (USE_MOCK) {
    if (!credentials.email.includes("@") || credentials.password.length < 6) {
      throw new Error("Enter a valid email and a password of at least 6 characters.");
    }
    mockCurrentUser = { id: "u1", email: credentials.email, name: "Mock Admin", role: "admin" };
    return { user: mockCurrentUser };
  }

  return request<{ user: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials)
  });
};

export const logout = async (): Promise<void> => {
  if (USE_MOCK) {
    mockCurrentUser = null;
    return;
  }
  await request("/auth/logout", { method: "POST" });
};

export const getCurrentUser = async (): Promise<User | null> => {
  if (USE_MOCK) {
    return mockCurrentUser;
  }
  try {
    const res = await request<{ user: User }>("/auth/me");
    return res.user || null;
  } catch (err: any) {
    if (err.status === 401 || err.status === 403) {
      return null;
    }
    return null;
  }
};
