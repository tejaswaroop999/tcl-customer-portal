"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function approveProofAction(formData: FormData) {
  const proofId = String(formData.get("proof_id"));
  const supabase = await createClient();
  await supabase.from("proofs").update({ status: "approved" }).eq("id", proofId);
  revalidatePath(`/orders/${String(formData.get("order_id"))}/proofs`);
}

export async function requestRevisionAction(formData: FormData) {
  const proofId = String(formData.get("proof_id"));
  const orderId = String(formData.get("order_id"));
  const notes = String(formData.get("notes"));

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: customer } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", user?.id)
    .single();

  await supabase.from("revision_requests").insert({
    proof_id: proofId,
    customer_id: customer?.id,
    notes,
  });

  await supabase
    .from("proofs")
    .update({ status: "revision_requested" })
    .eq("id", proofId);

  revalidatePath(`/orders/${orderId}/proofs`);
}
