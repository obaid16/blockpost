"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingPost, setFetchingPost] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setFetchingPost(true);
        const apiUrl = typeof window !== "undefined" ? `${window.location.origin}/api/posts?id=${postId}` : `/api/posts?id=${postId}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Could not fetch post.");
        }

        const post = data.post || data.posts?.[0];
        if (!post) {
          throw new Error("Post not found.");
        }

        setTitle(post.title);
        setDescription(post.description);
      } catch (error) {
        console.error(error);
        showToast(error.message || "Error loading post", "error");
        setTimeout(() => router.push("/posts"), 2000);
      } finally {
        setFetchingPost(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, router]);

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
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: postId, title, description })
      });

      const result = await response.json().catch(() => {
        throw new Error("Server did not return valid JSON. Check API status.");
      });

      if (!response.ok || !result.success) {
        throw new Error(result?.message || "Unable to update post.");
      }

      showToast("Post updated successfully!", "success");
      setTimeout(() => router.push("/posts"), 1200);
    } catch (error) {
      console.error(error);
      showToast(error.message || "Unexpected error", "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingPost) {
    return (
      <section className="card max-w-3xl p-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
          <span className="ml-2 text-slate-600">Loading post...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="card max-w-3xl p-8">
      <h1 className="mb-4 text-3xl font-bold text-brand-900">Edit Post</h1>
      <p className="mb-6 text-sm text-slate-600">Update the title and description of your post.</p>

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
            placeholder="Update post title..."
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
            placeholder="Update post details..."
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="btn flex-1 justify-center rounded-xl bg-brand-800 px-6 py-3 text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/posts")}
            className="btn rounded-xl border border-slate-300 px-6 py-3 text-slate-700 hover:bg-slate-50"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>

      {toast && (
        <div
          className={`mt-4 rounded-lg border p-3 text-sm font-medium ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
              : "bg-rose-50 text-rose-800 ring-1 ring-rose-200"
          }`}
        >
          <div className="flex items-center">
            {toast.type === "success" ? (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            ) : (
              <AlertCircle className="mr-2 h-4 w-4" />
            )}
            {toast.message}
          </div>
        </div>
      )}
    </section>
  );
}
