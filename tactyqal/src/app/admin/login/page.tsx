"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

export default function Login() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr("");
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    if (!email.includes("@") || password.length < 6) {
      setErr("Enter a valid email and a password of at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      router.push("/admin/posts");
    } catch (error: any) {
      setErr(error.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-sm px-4 py-20">
      <h1 className="font-display text-2xl font-bold">Admin sign in</h1>
      <p className="mt-1 text-sm text-ink/70">
        Enter your administrative credentials to manage posts and content.
      </p>
      <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium">
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="input mt-1"
          />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            name="password"
            type={show ? "text" : "password"}
            required
            autoComplete="current-password"
            className="input mt-1"
          />
        </label>
        <label className="flex gap-2 text-sm">
          <input type="checkbox" onChange={(e) => setShow(e.target.checked)} />
          Show password
        </label>
        {err && (
          <p role="alert" className="text-sm text-red-700">
            {err}
          </p>
        )}
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
