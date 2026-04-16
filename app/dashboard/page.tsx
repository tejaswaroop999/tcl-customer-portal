import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/auth-actions";
import { createClient } from "@/lib/supabase/server";
import { OrderStatus } from "@/lib/supabase/types";

const statusColor: Record<OrderStatus, string> = {
  new: "bg-sky-100 text-sky-800 border border-sky-200",
  proof_pending: "bg-amber-100 text-amber-800 border border-amber-200",
  proof_ready: "bg-purple-100 text-purple-800 border border-purple-200",
  approved: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  in_production: "bg-indigo-100 text-indigo-800 border border-indigo-200",
  shipped: "bg-blue-100 text-blue-800 border border-blue-200",
  complete: "bg-zinc-200 text-zinc-800 border border-zinc-300",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: customer } = await supabase
    .from("users")
    .select("id, name, organization")
    .eq("auth_user_id", user.id)
    .single();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, event_name, due_date, status")
    .order("created_at", { ascending: false });

  const allOrders = orders ?? [];
  const activeOrderCount = allOrders.filter(
    (order) => order.status !== "complete" && order.status !== "shipped",
  ).length;
  const approvedOrderCount = allOrders.filter(
    (order) => order.status === "approved",
  ).length;
  const nextDueDate = allOrders
    .map((order) => order.due_date)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0];
  const firstName = customer?.name?.split(" ")[0] ?? "there";

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl bg-zinc-50 px-6 py-10 text-zinc-900">
      <header className="mb-6 flex items-start justify-between rounded-2xl border border-zinc-200 bg-gradient-to-r from-white to-indigo-50 p-6 shadow-sm">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-900">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            {customer?.organization
              ? `${customer.organization} customer workspace`
              : "Customer workspace"}
          </p>
        </div>
        <form action={logoutAction}>
          <button className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900">
            Log out
          </button>
        </form>
      </header>

      <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-zinc-600">
          Keep your merch timeline on track from quote to proof approval.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-zinc-100 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
              Active orders
            </p>
            <p className="mt-1 text-2xl font-semibold">{activeOrderCount}</p>
          </div>
          <div className="rounded-xl bg-zinc-100 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
              Proofs approved
            </p>
            <p className="mt-1 text-2xl font-semibold">{approvedOrderCount}</p>
          </div>
          <div className="rounded-xl bg-zinc-100 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
              Next due date
            </p>
            <p className="mt-1 text-base font-semibold">
              {nextDueDate ? nextDueDate : "No upcoming dates"}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Link
            href="/orders/new"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Create New Order
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-5 py-4 font-semibold text-zinc-900">
          Your Orders
        </div>
        <ul className="divide-y divide-zinc-200">
          {allOrders.map((order) => (
            <li key={order.id} className="px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-zinc-900">{order.event_name}</p>
                  <p className="text-sm text-zinc-500">Due: {order.due_date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor[order.status as OrderStatus]}`}
                  >
                    {order.status}
                  </span>
                  <Link
                    href={`/orders/${order.id}/proofs`}
                    className="text-sm font-medium text-indigo-700 underline underline-offset-2"
                  >
                    View proofs
                  </Link>
                </div>
              </div>
            </li>
          ))}
          {!orders?.length && (
            <li className="px-4 py-8 text-center text-sm text-zinc-600">
              No orders yet. Create your first one.
            </li>
          )}
        </ul>
      </section>
    </main>
  );
}
