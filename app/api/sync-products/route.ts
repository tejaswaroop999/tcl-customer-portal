import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const mockShopifyProducts = [
  {
    sku: "TEE-001",
    name: "Classic Tee",
    category: "tshirts",
    turnaround_days: 10,
    starting_price: 14.5,
    is_featured: true,
    print_types_available: ["screen_print", "puff_print"],
  },
  {
    sku: "HOOD-002",
    name: "Premium Hoodie",
    category: "hoodies",
    turnaround_days: 14,
    starting_price: 33,
    is_featured: true,
    print_types_available: ["embroidery", "screen_print", "foil"],
  },
];

export async function POST() {
  const supabase = await createClient();
  const { error } = await supabase.from("products").upsert(mockShopifyProducts, {
    onConflict: "sku",
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, synced: mockShopifyProducts.length });
}
