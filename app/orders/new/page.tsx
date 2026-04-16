import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { OrderForm } from "@/app/orders/new/order-form";

export default async function CreateOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, sku, name, category, starting_price")
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true });

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl bg-zinc-50 px-6 py-10 text-zinc-900">
      <div className="rounded-2xl border border-zinc-200 bg-gradient-to-r from-white to-indigo-50 p-6 shadow-sm">
        <Link href="/dashboard" className="text-sm font-medium text-indigo-700 underline">
          Back to dashboard
        </Link>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-900">Create New Order</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Follow the 3-step flow to select products, upload designs, and submit for proofing.
        </p>
      </div>
      <OrderForm products={products ?? []} error={error} />
    </main>
  );
}
