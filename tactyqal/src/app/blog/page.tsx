import BlogList from "@/components/BlogList";
import { listPosts, type Post } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Blog" };

export default async function Blog() {
  let posts: Post[] = [];
  try {
    posts = (await listPosts()).filter((p) => p.status === "published");
  } catch (err) {
    console.error("Unable to load blog posts from backend:", err);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold">Learn from industry experts</h1>
      <p className="mb-8 mt-2 text-ink/80">Articles on startup ideas, pitching and building teams.</p>
      {posts.length === 0 ? (
        <div className="rounded-md border border-line bg-white p-6 text-center text-ink/70">
          <p className="font-medium">No published articles available right now.</p>
          <p className="mt-1 text-sm text-ink/50">Please ensure the backend API and database are connected.</p>
        </div>
      ) : (
        <BlogList posts={posts} />
      )}
    </main>
  );
}
