"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgePercent, ChevronRight, Sparkles, Tag } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type DiscountMethod = "code" | "automatic";
type ValueType = "percentage" | "fixed";

function SectionCard({ children }: { children: React.ReactNode }) {
  return <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">{children}</section>;
}

const inputClass = "h-9 w-full rounded-lg border border-black/25 bg-white px-3 text-sm outline-none transition focus:border-black/55 focus:ring-2 focus:ring-black/5";

type DiscountProduct = { id: string; name: string };

export function TargetPickerDialog({
  open,
  onOpenChange,
  selectedIds,
  onAdd,
}: {
  kind: "products";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  onAdd: (ids: string[]) => void;
}) {
  const [products, setProducts] = useState<DiscountProduct[]>([]);
  const [draftIds, setDraftIds] = useState(selectedIds);

  useEffect(() => {
    if (!open) return;
    fetch("/api/products")
      .then((response) => response.json())
      .then((payload) => setProducts(Array.isArray(payload.data) ? payload.data : []))
      .catch(() => setProducts([]));
  }, [open, selectedIds]);

  function toggle(id: string) {
    setDraftIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(560px,calc(100vw-2rem))] gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-[560px]">
        <DialogHeader className="border-b border-black/10 px-4 py-5"><DialogTitle>Select products</DialogTitle><DialogDescription>Choose products for this discount.</DialogDescription></DialogHeader>
        <div className="max-h-[360px] overflow-y-auto">
          {products.map((product) => <label key={product.id} className="flex cursor-pointer items-center gap-3 border-b border-black/[0.08] px-4 py-3 hover:bg-black/[0.02]"><input type="checkbox" checked={draftIds.includes(product.id)} onChange={() => toggle(product.id)} className="size-4 accent-black" /><span className="text-sm font-medium">{product.name}</span></label>)}
          {products.length === 0 ? <p className="px-4 py-10 text-center text-sm text-black/55">No products are available.</p> : null}
        </div>
        <DialogFooter className="flex-row justify-end gap-2 border-t border-black/10 px-4 py-3"><button type="button" onClick={() => onOpenChange(false)} className="h-8 rounded-lg border border-black/15 px-3 text-sm font-medium hover:bg-black/[0.03]">Cancel</button><button type="button" onClick={() => { onAdd(draftIds); onOpenChange(false); }} className="h-8 rounded-lg bg-black px-3 text-sm font-medium text-white hover:bg-black/80">Add products</button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AmountOffProductsEditor() {
  const router = useRouter();
  const [method, setMethod] = useState<DiscountMethod>("code");
  const [valueType, setValueType] = useState<ValueType>("percentage");
  const [code, setCode] = useState("");
  const [value, setValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const numericValue = Number(value);
  const isValueValid = Number.isFinite(numericValue) && numericValue > 0 && (valueType !== "percentage" || numericValue <= 100);
  const canSave = isValueValid && (method === "automatic" || code.trim().length > 0) && !isSaving;

  function generateCode() {
    setCode(`XELECTRON-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
  }

  async function saveDiscount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave) return;

    setIsSaving(true);
    setError("");
    try {
      const response = await fetch("/api/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: method === "code" ? code : null,
          type: valueType === "percentage" ? "PERCENTAGE" : "FIXED_AMOUNT",
          value: numericValue,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not create the discount");

      router.push("/dashboard/discounts");
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not create the discount");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-full flex-1 bg-[#f5f5f5] p-4 text-black sm:p-5">
      <form className="mx-auto max-w-[970px]" onSubmit={saveDiscount}>
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-1.5 text-lg font-semibold"><Tag className="size-4" /><ChevronRight className="size-4 text-black/45" /> Create discount</h1>
            <p className="mt-1 text-sm text-black/55">Create a product discount for every customer in your online store.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/discounts" className="inline-flex h-8 items-center rounded-lg bg-black/[0.06] px-3 text-xs font-medium transition hover:bg-black/10">Discard</Link>
            <button type="submit" disabled={!canSave} className="inline-flex h-8 items-center rounded-lg bg-black px-3 text-xs font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-black/15">{isSaving ? "Creating…" : "Create discount"}</button>
          </div>
        </header>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-4">
            <SectionCard>
              <h2 className="text-sm font-semibold">Discount method</h2>
              <div className="mt-4 inline-flex overflow-hidden rounded-lg border border-black/15">
                <button type="button" onClick={() => setMethod("code")} className={`h-9 px-3 text-sm font-medium ${method === "code" ? "bg-black/[0.12]" : "bg-white hover:bg-black/[0.03]"}`}>Discount code</button>
                <button type="button" onClick={() => setMethod("automatic")} className={`h-9 border-l border-black/15 px-3 text-sm font-medium ${method === "automatic" ? "bg-black/[0.12]" : "bg-white hover:bg-black/[0.03]"}`}>Automatic discount</button>
              </div>
              {method === "code" ? (
                <div className="mt-5">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="discount-code" className="text-sm font-medium text-black/75">Discount code</label>
                    <button type="button" onClick={generateCode} className="text-xs font-medium text-[#005BD3] hover:underline">Generate code</button>
                  </div>
                  <input id="discount-code" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="SAVE10" className={`${inputClass} mt-1.5 uppercase`} />
                  <p className="mt-1.5 text-xs text-black/55">Customers enter this code at checkout.</p>
                </div>
              ) : <p className="mt-4 text-sm text-black/60">This discount is applied automatically when a customer qualifies.</p>}
            </SectionCard>

            <SectionCard>
              <h2 className="text-sm font-semibold">Discount value</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_190px]">
                <label className="grid gap-1.5 text-sm font-medium text-black/75">Type
                  <select value={valueType} onChange={(event) => setValueType(event.target.value as ValueType)} className={inputClass}>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed amount</option>
                  </select>
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-black/75">Value
                  <div className="relative"><input aria-label="Discount value" inputMode="decimal" value={value} onChange={(event) => setValue(event.target.value)} placeholder={valueType === "percentage" ? "10" : "500"} className={`${inputClass} pr-9`} /><span className="pointer-events-none absolute right-3 top-2 text-sm text-black/50">{valueType === "percentage" ? "%" : "₹"}</span></div>
                </label>
              </div>
              {value && !isValueValid ? <p className="mt-2 text-xs text-red-700">Enter a valid {valueType === "percentage" ? "percentage from 1 to 100" : "amount"}.</p> : null}
            </SectionCard>

            <SectionCard>
              <h2 className="text-sm font-semibold">Eligibility</h2>
              <div className="mt-4 rounded-lg border border-black/10 bg-black/[0.025] px-3 py-3 text-sm text-black/70">All customers, on all products</div>
              <p className="mt-2 text-xs text-black/55">The discount starts active as soon as you create it.</p>
            </SectionCard>

            {error ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}
          </div>

          <aside className="space-y-4">
            <SectionCard>
              <div className="flex size-9 items-center justify-center rounded-lg bg-[#005BD3]/10 text-[#005BD3]"><BadgePercent className="size-5" /></div>
              <h2 className="mt-4 text-sm font-semibold">{method === "code" ? code || "Your discount code" : "Automatic discount"}</h2>
              <p className="mt-1 text-sm text-black/60">{value ? `${value}${valueType === "percentage" ? "%" : " ₹"} off` : "Set a discount value"}</p>
              <dl className="mt-6 space-y-3 border-t border-black/10 pt-4 text-sm">
                <div className="flex items-center justify-between gap-3"><dt className="text-black/55">Method</dt><dd className="font-medium">{method === "code" ? "Code" : "Automatic"}</dd></div>
                <div className="flex items-center justify-between gap-3"><dt className="text-black/55">Applies to</dt><dd className="font-medium">All products</dd></div>
                <div className="flex items-center justify-between gap-3"><dt className="text-black/55">Status</dt><dd className="font-medium text-emerald-700">Active</dd></div>
              </dl>
            </SectionCard>
            <SectionCard>
              <div className="flex items-start gap-2.5"><Sparkles className="mt-0.5 size-4 shrink-0 text-[#005BD3]" /><p className="text-sm leading-5 text-black/65">Use a short code that is easy for customers to remember and share.</p></div>
            </SectionCard>
          </aside>
        </div>
      </form>
    </main>
  );
}
