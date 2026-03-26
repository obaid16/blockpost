import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="card p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-900">Welcome to Block Post Manager</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage all posts, block bad entries, and keep a clean feed.
          </p>
        </div>
        <BookOpen className="h-10 w-10 text-brand-700" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link href="/create-post" className="card border-2 border-accent p-5 hover:shadow-lg">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-brand-900">
            Create a new post <ChevronRight size={16} />
          </h2>
          <p className="text-sm text-slate-500">Quickly add a post for admin review</p>
        </Link>

        <Link href="/posts" className="card border-2 border-blue-300 p-5 hover:shadow-lg">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-brand-900">
            View all posts <ChevronRight size={16} />
          </h2>
          <p className="text-sm text-slate-500">Monitor and manage post statuses</p>
        </Link>
      </div>
    </div>
  );
}
