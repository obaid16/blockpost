"use client";

import Link from "next/link";
import { Home, PlusCircle } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full bg-gradient-to-r from-brand-700 via-brand-800 to-brand-900 shadow-card">
      <div className="container flex items-center justify-between py-4">
        <Link href="/posts">
          <span className="text-white text-xl font-extrabold tracking-wide leading-tight">Block Post Manager</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-2">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <Home size={16} />
            Posts
          </Link>
          <Link
            href="/create-post"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-navy-800 transition hover:bg-yellow-600"
          >
            <PlusCircle size={16} />
            Create Post
          </Link>
        </nav>
      </div>
    </header>
  );
}
