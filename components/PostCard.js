"use client";

import { CheckCircle2, Edit2, Slash, Trash2 } from "lucide-react";
import Link from "next/link";

export default function PostCard({ post, onUpdateStatus, onDelete, isProcessing }) {
  const now = new Date(post.createdAt).toLocaleString();

  return (
    <article className="card mb-4 p-5 transition-transform duration-250 hover:-translate-y-1">
      <div className="mb-3">
        <h3 className="text-xl font-bold text-slate-900">{post.title}</h3>
        <p className="text-sm text-slate-500">{post.description}</p>
      </div>
      <p className="mb-4 text-xs text-slate-400">Created: {now}</p>
      <div className="flex flex-wrap gap-2">
        {post.status === "Active" ? (
          <button
            type="button"
            className="btn bg-rose-600 text-white hover:bg-rose-500"
            onClick={() => onUpdateStatus(post._id, "Blocked")}
            disabled={isProcessing}
          >
            <Slash size={16} />
            Block
          </button>
        ) : (
          <button
            type="button"
            className="btn bg-emerald-600 text-white hover:bg-emerald-500"
            onClick={() => onUpdateStatus(post._id, "Active")}
            disabled={isProcessing}
          >
            <CheckCircle2 size={16} />
            Unblock
          </button>
        )}
        <Link href={`/posts/${post._id}/edit`} className="btn bg-blue-600 text-white hover:bg-blue-500">
          <Edit2 size={16} />
          Edit
        </Link>
        <button
          type="button"
          className="btn bg-gray-200 text-gray-700 hover:bg-gray-300"
          onClick={() => onDelete(post._id)}
          disabled={isProcessing}
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </article>
  );
}
