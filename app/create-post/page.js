"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      showToast("Both title and description are required.", "error");
      return;
    }

    setLoading(true);
    try {
      const apiUrl = typeof window !== "undefined" ? `${window.location.origin}/api/posts` : "/api/posts";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
      });

      const result = await response.json().catch(() => {
        throw new Error("Server did not return valid JSON. Check API status.");
      });
      if (!response.ok || !result.success) {
        throw new Error(result?.message || "Unable to create post.");
      }

      showToast("Post created successfully!", "success");
      setTimeout(() => router.push("/posts"), 1200);
    } catch (error) {
      console.error(error);
      showToast(error.message || "Unexpected error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card max-w-3xl p-8">
      <h1 className="mb-4 text-3xl font-bold text-brand-900">Create New Post</h1>
      <p className="mb-6 text-sm text-slate-600">
        Add a title and description to start with Active status. Admin can block/unblock/delete later.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            placeholder="Example: Introduction to Block Post Management"
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            placeholder="Type your post details..."
          />
        </div>

        <button
          type="submit"
          className="btn w-full justify-center rounded-xl bg-brand-800 px-6 py-3 text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          {loading ? "Saving..." : "Create post"}
        </button>
      </form>

      {toast && (
        <div
          className={`mt-4 rounded-lg border p-3 text-sm font-medium ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="inline-block mr-2 h-4 w-4" />
          ) : (
            <AlertCircle className="inline-block mr-2 h-4 w-4" />
          )}
          {toast.message}
        </div>
      )}
    </section>
  );
}
