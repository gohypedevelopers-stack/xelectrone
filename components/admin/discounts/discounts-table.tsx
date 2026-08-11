"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export type DiscountTableItem = {
  id: string;
  code: string | null;
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  value: number;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
};

function discountValue(discount: DiscountTableItem) {
  return discount.type === "PERCENTAGE" ? `${discount.value}% off` : `₹${discount.value.toLocaleString("en-IN")} off`;
}

export function DiscountsTable({ discounts }: { discounts: DiscountTableItem[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function deleteDiscount(discount: DiscountTableItem) {
    if (!window.confirm(`Delete ${discount.code || "this automatic discount"}? This cannot be undone.`)) return;
    setDeletingId(discount.id);
    setError("");
    try {
      const response = await fetch(`/api/discounts/${discount.id}`, { method: "DELETE" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not delete the discount");
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete the discount");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="mt-4 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
      {error ? <p role="alert" className="border-b border-red-200 bg-red-50 px-4 py-2 text-xs text-red-800">{error}</p> : null}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <thead className="bg-black/[0.025] text-xs text-black/65"><tr>{["Discount", "Status", "Value", "Usage", "Created", ""].map((heading) => <th key={heading || "actions"} className="border-b border-black/10 px-4 py-3 font-medium">{heading}</th>)}</tr></thead>
          <tbody>{discounts.map((discount) => <tr key={discount.id} className="transition-colors hover:bg-black/[0.02]">
            <td className="border-b border-black/10 px-4 py-3"><p className="font-medium text-black">{discount.code || "Automatic discount"}</p><p className="mt-0.5 text-xs text-black/55">All products</p></td>
            <td className="border-b border-black/10 px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${discount.isActive ? "bg-emerald-100 text-emerald-800" : "bg-black/[0.07] text-black/65"}`}>{discount.isActive ? "Active" : "Inactive"}</span></td>
            <td className="border-b border-black/10 px-4 py-3 font-medium">{discountValue(discount)}</td>
            <td className="border-b border-black/10 px-4 py-3">{discount.usageCount} used</td>
            <td className="border-b border-black/10 px-4 py-3 text-black/65">{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(discount.createdAt))}</td>
            <td className="border-b border-black/10 px-4 py-3 text-right"><button type="button" disabled={deletingId === discount.id} onClick={() => deleteDiscount(discount)} className="inline-flex size-8 items-center justify-center rounded-md text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-red-300" aria-label={`Delete ${discount.code || "automatic discount"}`}><Trash2 className="size-4" /></button></td>
          </tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
