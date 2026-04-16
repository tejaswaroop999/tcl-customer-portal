"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function uploadDesignFile(params: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  file: File | null;
  customerId: string;
  side: "front" | "back";
}) {
  const { supabase, file, customerId, side } = params;
  if (!file || file.size === 0) {
    return null;
  }

  const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${customerId}/${Date.now()}-${side}-${safeFileName}`;

  const { error } = await supabase.storage
    .from("design-files")
    .upload(filePath, file, { upsert: true, contentType: file.type });

  if (error) {
    throw new Error(
      `Unable to upload ${side} design file. Ensure 'design-files' bucket exists and is writable.`,
    );
  }

  const { data } = supabase.storage.from("design-files").getPublicUrl(filePath);
  return data.publicUrl;
}

export async function createOrderAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: customer } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  const products = formData.getAll("products").map(String);
  const productSelections = products.map((sku) => {
    const color = String(formData.get(`product_color_${sku}`) ?? "");
    return color ? `${sku}:${color}` : sku;
  });
  const selectedPrintType = String(formData.get("print_type") ?? "screen_print");
  const customerId = customer?.id;

  if (!customerId) {
    redirect("/orders/new?error=Customer profile not found for this auth user");
  }

  let frontDesignFileUrl: string | null = null;
  let backDesignFileUrl: string | null = null;

  try {
    frontDesignFileUrl = await uploadDesignFile({
      supabase,
      file: (formData.get("front_design_file") as File | null) ?? null,
      customerId,
      side: "front",
    });
    backDesignFileUrl = await uploadDesignFile({
      supabase,
      file: (formData.get("back_design_file") as File | null) ?? null,
      customerId,
      side: "back",
    });
  } catch (uploadError) {
    const message =
      uploadError instanceof Error ? uploadError.message : "File upload failed";
    redirect(`/orders/new?error=${encodeURIComponent(message)}`);
  }

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      customer_id: customerId,
      event_name: String(formData.get("event_name")),
      due_date: String(formData.get("due_date")),
      order_type: String(formData.get("order_type")),
      products_selected: productSelections,
      print_type: selectedPrintType,
      front_design_description: String(formData.get("front_design_description")),
      back_design_description: String(formData.get("back_design_description")),
      front_design_file: frontDesignFileUrl,
      back_design_file: backDesignFileUrl,
      design_direction: String(formData.get("design_direction")),
      status: "new",
    })
    .select("id")
    .single();

  if (error || !order) {
    redirect(`/orders/new?error=${encodeURIComponent(error?.message ?? "Unable to create order")}`);
  }

  redirect("/dashboard");
}
