import Link from "next/link";
import { signUpAction } from "@/app/auth-actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <div className="w-full rounded-xl border border-zinc-200 bg-white p-6 text-zinc-900 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Create account</h1>
        <p className="mt-1 text-sm text-zinc-600">
          This signs up a customer user in Supabase Auth.
        </p>
        <form action={signUpAction} className="mt-6 space-y-4">
          <input
            name="full_name"
            required
            placeholder="Full name"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
          />
          <input
            name="organization"
            required
            placeholder="Organization"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
          >
            Create customer account
          </button>
        </form>
        <p className="mt-4 text-sm text-zinc-600">
          Have an account?{" "}
          <Link href="/login" className="text-indigo-700 underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
