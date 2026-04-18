"use client";

import { useMemo, useState } from "react";
import { createOrderAction } from "@/app/orders/new/actions";

type ProductOption = {
  id: string;
  sku: string;
  name: string;
  category: string;
  starting_price: number;
};

type StepKey = 1 | 2 | 3;

const stepTitles: Record<StepKey, string> = {
  1: "Product Selection",
  2: "Design Details",
  3: "Print Type & Submit",
};

export function OrderForm({
  products,
  error,
}: {
  products: ProductOption[];
  error?: string;
}) {
  const [step, setStep] = useState<StepKey>(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const selectedProductRows = useMemo(
    () => products.filter((product) => selectedProducts.includes(product.sku)),
    [products, selectedProducts],
  );

  function toggleProduct(sku: string) {
    setSelectedProducts((current) =>
      current.includes(sku)
        ? current.filter((item) => item !== sku)
        : [...current, sku],
    );
  }

  return (
    <form action={createOrderAction} className="mt-6 space-y-6 text-zinc-900">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-zinc-600">
          Step {step} of 3 · {stepTitles[step]}
        </p>
        <div className="mt-3 flex gap-2">
          {[1, 2, 3].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setStep(value as StepKey)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${step === value
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {step === 1 ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Step 1 - Product Selection</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="event_name"
              required
              placeholder="Event name"
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
            />
            <input
              name="due_date"
              type="date"
              required
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
            />
          </div>
          <select
            name="order_type"
            className="mt-3 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
          >
            <option value="group_order">Group Order</option>
            <option value="get_a_link">Get a Link</option>
          </select>
          <div className="mt-4 space-y-2">
            {products.map((product) => (
              <label
                key={product.id}
                className="flex items-center justify-between rounded-xl border border-zinc-200 p-4 text-sm"
              >
                <span>
                  {product.name} ({product.category}) - ${product.starting_price}
                </span>
                <input
                  type="checkbox"
                  name="products"
                  checked={selectedProducts.includes(product.sku)}
                  onChange={() => toggleProduct(product.sku)}
                  value={product.sku}
                />
              </label>
            ))}
          </div>

          {!!selectedProductRows.length && (
            <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="mb-2 text-sm font-medium text-zinc-700">
                Choose colors for selected products
              </p>
              <div className="space-y-2">
                {selectedProductRows.map((product) => (
                  <div key={product.sku} className="grid gap-2 sm:grid-cols-2">
                    <p className="self-center text-sm">{product.name}</p>
                    <input
                      required
                      name={`product_color_${product.sku}`}
                      placeholder="Color choice (e.g. Navy, White)"
                      className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      ) : null}

      {step === 2 ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Step 2 - Design Details</h2>
          <textarea
            name="front_design_description"
            required
            placeholder="Front design description"
            className="mb-3 min-h-24 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
          />
          <textarea
            name="back_design_description"
            required
            placeholder="Back design description"
            className="mb-3 min-h-24 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
          />

          <label className="mb-3 block text-sm font-medium text-zinc-700">
            Front design file (uploads to Supabase Storage)
            <input
              name="front_design_file"
              type="file"
              accept=".ai,.pdf,.png,.jpg,.jpeg,.svg"
              required
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700">
            Back design file (optional)
            <input
              name="back_design_file"
              type="file"
              accept=".ai,.pdf,.png,.jpg,.jpeg,.svg"
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
            />
          </label>
          <select
            name="design_direction"
            className="mt-3 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
          >
            <option value="copy_exactly">Copy exactly</option>
            <option value="use_as_inspiration">Use as inspiration</option>
            <option value="designers_choice">Designer&apos;s choice</option>
          </select>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Step 3 - Print Type Selection</h2>
          <select
            name="print_type"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
          >
            <option value="screen_print">Screen printing (min 24, 10-14 days)</option>
            <option value="embroidery">Embroidery (min 12, 12-16 days)</option>
            <option value="puff_print">Puff print (min 24, 10-14 days)</option>
            <option value="foil">Foil (min 36, 12-18 days)</option>
            <option value="dye_sublimation">
              Dye sublimation (min 24, 10-14 days)
            </option>
          </select>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium"
            >
              Back
            </button>
            <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
              Submit order
            </button>
          </div>
        </section>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex gap-2">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((step - 1) as StepKey)}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium"
          >
            Previous Step
          </button>
        )}
        {step < 3 && (
          <button
            type="button"
            onClick={() => setStep((step + 1) as StepKey)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Continue
          </button>
        )}
      </div>
    </form>
  );
}
