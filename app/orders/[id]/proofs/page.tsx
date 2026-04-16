import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import {
  approveProofAction,
  requestRevisionAction,
} from "@/app/orders/[id]/proofs/actions";

export default async function ProofReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: proofs } = await supabase
    .from("proofs")
    .select(
      "id, proof_number, product, color, print_type, est_ship_date, price_tiers, status, mockup_image_url",
    )
    .eq("order_id", id)
    .order("proof_number");

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl bg-zinc-50 px-6 py-10 text-zinc-900">
      <div className="rounded-2xl border border-zinc-200 bg-gradient-to-r from-white to-indigo-50 p-6 shadow-sm">
        <Link href="/dashboard" className="text-sm font-medium text-indigo-700 underline">
          Back to dashboard
        </Link>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-900">Proof Review</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Review each proof, then approve or request revisions before production.
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        {(proofs ?? []).map((proof) => (
          <article
            key={proof.id}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900">
                Proof #{proof.proof_number} - {proof.product}
              </h2>
              <span className="rounded-full border border-zinc-300 bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700">
                {proof.status}
              </span>
            </div>
            <p className="text-sm text-zinc-600">
              Color: {proof.color} · Print type: {proof.print_type} · Est. ship:{" "}
              {proof.est_ship_date}
            </p>
            <p className="mt-2 text-sm text-zinc-600">Price tiers:</p>
            <pre className="mt-1 overflow-x-auto rounded-lg bg-zinc-100 p-2 text-xs text-zinc-700">
              {JSON.stringify(proof.price_tiers, null, 2)}
            </pre>
            <Image
              src={proof.mockup_image_url || "https://placehold.co/1200x675?text=Proof+Mockup"}
              alt={`Mockup ${proof.proof_number}`}
              width={1200}
              height={675}
              className="mt-4 aspect-video w-full rounded-md border border-zinc-200 object-cover"
            />
            <div className="mt-4 flex gap-3">
              <form action={approveProofAction}>
                <input type="hidden" name="proof_id" value={proof.id} />
                <input type="hidden" name="order_id" value={id} />
                <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                  Approve Proof
                </button>
              </form>
              <form action={requestRevisionAction} className="flex gap-2">
                <input type="hidden" name="proof_id" value={proof.id} />
                <input type="hidden" name="order_id" value={id} />
                <input
                  required
                  name="notes"
                  placeholder="Revision notes"
                  className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
                />
                <button className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium">
                  Request Revision
                </button>
              </form>
            </div>
          </article>
        ))}
        {!proofs?.length && (
          <p className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 shadow-sm">
            No proofs found for this order yet.
          </p>
        )}
      </div>
    </main>
  );
}
