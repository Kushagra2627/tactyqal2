import { notFound } from "next/navigation";
import { getPost, type Post } from "@/lib/api";
import ArticleView from "@/components/ArticleView";

export const dynamic = "force-dynamic";

// Force reload after chunk update

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const p = await getPost(params.slug);
    return { title: p?.title ?? "Not found", description: p?.excerpt };
  } catch {
    return { title: "Blog Article | Tactyqal Labs" };
  }
}

export default async function Article({ params }: { params: { slug: string } }) {
  let p: Post | null = null;
  try {
    p = await getPost(params.slug);
  } catch (err) {
    console.error("Unable to load article from backend:", err);
  }

  if (!p) notFound();

  return <ArticleView post={p} />;
}
