"use client";

import PostCard from "@/components/PostCard";
import { Loader2, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const apiUrl = typeof window !== "undefined" ? `${window.location.origin}/api/posts` : "/api/posts";
      const response = await fetch(apiUrl);
      const data = await response.json().catch(() => {
        throw new Error("Server did not return valid JSON. Check API status.");
      });
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not fetch posts.");
      }
      setPosts(data.posts || []);
    } catch (error) {
      console.error(error);
      showToast(error.message || "Error fetching posts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const updateStatus = async (id, status) => {
    setProcessing(id);
    try {
      const response = await fetch("/api/posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Status update failed.");
      }
      setPosts((current) => current.map((post) => (post._id === id ? { ...post, status } : post)));
      showToast(`Post ${status === "Blocked" ? "blocked" : "unblocked"} successfully.`, "success");
    } catch (error) {
      console.error(error);
      showToast(error.message || "Failed to update status", "error");
    } finally {
      setProcessing(null);
    }
  };

  const deletePost = async (id) => {
    const confirmed = confirm("Delete post permanently? This cannot be undone.");
    if (!confirmed) return;

    setProcessing(id);
    try {
      const response = await fetch(`/api/posts?id=${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Delete failed.");
      }
      setPosts((prev) => prev.filter((post) => post._id !== id));
      showToast("Post deleted successfully.", "success");
    } catch (error) {
      console.error(error);
      showToast(error.message || "Failed to delete", "error");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand-900">Posts</h1>
        <Link
          href="/create-post"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-navy-800 transition hover:bg-yellow-600"
        >
          <PlusCircle size={16} />
          Add Post
        </Link>
      </div>

      {toast && (
        <div
          className={`rounded-lg p-3 text-sm font-medium ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
              : "bg-rose-50 text-rose-800 ring-1 ring-rose-200"
          }`}
        >
          {toast.message}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-brand-600" />
          Loading posts...
        </div>
      ) : posts.length === 0 ? (
        <div className="card border-dashed border-brand-300 p-10 text-center">
          <h2 className="text-xl font-semibold text-brand-700">No posts yet</h2>
          <p className="mt-2 text-sm text-slate-500">You can create the first post with the button above.</p>
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onUpdateStatus={updateStatus}
              onDelete={deletePost}
              isProcessing={processing === post._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
