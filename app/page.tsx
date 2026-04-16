import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 py-16">
      <main className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">
          TCL Hiring Test
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900">
          Customer Portal Migration - Phase 1
        </h1>
        <p className="max-w-2xl text-zinc-600">
          This app includes customer authentication, order creation, and proof
          review workflows backed by Supabase with row-level security.
        </p>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900"
          >
            Sign up
          </Link>
        </div>
      </main>
    </div>
  );
}
