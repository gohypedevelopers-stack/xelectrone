"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ClipboardPenLine, Minus, PackagePlus, Plus, Save, Search, Trash2, UserRound, X } from "lucide-react";

import { AppSidebar } from "@/components/admin/navigation/app-sidebar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getDraftOrder, saveDraftOrder, type DraftOrderItem } from "@/lib/draft-orders";
import { formatINR } from "@/lib/format-price";

type DashboardProduct = {
  id: string;
  name: string;
  price: string;
  mainImage?: string | null;
  quantity?: number;
  category?: { title: string } | string | null;
};

function priceToNumber(value: string | number) {
  const numberValue = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function productCategory(product: DashboardProduct) {
  return typeof product.category === "string" ? product.category : product.category?.title || "Uncategorised";
}

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return <section className="rounded-xl border border-black/10 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-4 py-3.5"><h2 className="text-sm font-semibold">{title}</h2>{action}</div><div className="p-4">{children}</div></section>;
}

function ProductPicker({ open, onOpenChange, products, onAdd }: { open: boolean; onOpenChange: (open: boolean) => void; products: DashboardProduct[]; onAdd: (products: DashboardProduct[]) => void }) {
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const matchingProducts = products.filter((product) => product.name.toLowerCase().includes(query.trim().toLowerCase()));
  const allMatchingSelected = matchingProducts.length > 0 && matchingProducts.every((product) => selectedIds.includes(product.id));

  function toggle(id: string) { setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); }
  function close() { setQuery(""); setSelectedIds([]); onOpenChange(false); }
  function addSelected() { onAdd(products.filter((product) => selectedIds.includes(product.id))); close(); }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => nextOpen ? onOpenChange(true) : close()}>
      <DialogContent data-lenis-prevent showCloseButton={false} overlayClassName="bg-black/35" className="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden rounded-xl p-0 sm:max-w-[720px]">
        <DialogTitle className="sr-only">Add dashboard products</DialogTitle>
        <div className="flex shrink-0 items-center justify-between border-b border-black/10 px-5 py-4"><div><h2 className="text-base font-semibold">Add products</h2><p className="mt-0.5 text-xs text-black/55">Choose from the products in your dashboard.</p></div><button type="button" onClick={close} aria-label="Close product picker" className="rounded-md p-1 text-black/50 hover:bg-black/5 hover:text-black"><X className="size-5" /></button></div>
        <div className="shrink-0 border-b border-black/10 p-4"><label className="flex h-10 items-center gap-2 rounded-lg border border-black/20 px-3 text-sm text-black/60 focus-within:border-black/45"><Search className="size-4" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-black/40" /></label></div>
        <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <table className="w-full table-fixed border-collapse text-left text-sm"><thead className="sticky top-0 z-10 bg-white text-xs text-black/55"><tr><th className="w-11 border-b border-black/10 px-4 py-3"><input type="checkbox" aria-label="Select all matching products" checked={allMatchingSelected} onChange={() => setSelectedIds((current) => allMatchingSelected ? current.filter((id) => !matchingProducts.some((product) => product.id === id)) : [...new Set([...current, ...matchingProducts.map((product) => product.id)])])} className="size-4 accent-black" /></th><th className="border-b border-black/10 px-3 py-3 font-medium">Product</th><th className="w-28 border-b border-black/10 px-3 py-3 font-medium">Stock</th><th className="w-28 border-b border-black/10 px-4 py-3 text-right font-medium">Price</th></tr></thead><tbody>{matchingProducts.map((product) => <tr key={product.id} className="hover:bg-black/[0.02]"><td className="border-b border-black/10 px-4 py-3 align-top"><input type="checkbox" aria-label={`Select ${product.name}`} checked={selectedIds.includes(product.id)} onChange={() => toggle(product.id)} className="mt-2 size-4 accent-black" /></td><td className="border-b border-black/10 px-3 py-3"><div className="flex min-w-0 items-center gap-3"><div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-black/[0.025]">{product.mainImage ? <Image src={product.mainImage} alt="" fill sizes="48px" className="object-contain p-1" /> : <span className="grid h-full place-items-center text-xs font-medium text-black/35">{product.name.charAt(0)}</span>}</div><div className="min-w-0 flex-1"><p title={product.name} className="truncate font-medium leading-5">{product.name}</p><p className="mt-0.5 truncate text-xs text-black/50">{productCategory(product)}</p></div></div></td><td className="border-b border-black/10 px-3 py-3 text-black/65">{product.quantity && product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}</td><td className="border-b border-black/10 px-4 py-3 text-right font-medium">{formatINR(product.price)}</td></tr>)}{matchingProducts.length === 0 ? <tr><td colSpan={4} className="px-4 py-12 text-center text-sm text-black/55">No dashboard products match your search.</td></tr> : null}</tbody></table>
        </div>
        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-black/10 px-4 py-3"><span className="text-xs text-black/55">{selectedIds.length} selected</span><div className="flex gap-2"><button type="button" onClick={close} className="h-8 rounded-lg border border-black/15 px-3 text-xs font-medium hover:bg-black/[0.03]">Cancel</button><button type="button" disabled={selectedIds.length === 0} onClick={addSelected} className="h-8 rounded-lg bg-black px-3 text-xs font-medium text-white hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-black/15">Add products</button></div></div>
      </DialogContent>
    </Dialog>
  );
}

export function CreateOrderClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draft");
  const [products, setProducts] = useState<DashboardProduct[]>([]);
  const [items, setItems] = useState<DraftOrderItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [note, setNote] = useState("");
  const [tags, setTags] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [draftReady, setDraftReady] = useState(!draftId);

  useEffect(() => {
    let active = true;
    async function loadProducts() {
      try {
        const response = await fetch("/api/products", { cache: "no-store" });
        const payload = await response.json();
        if (!response.ok || !payload.success) throw new Error(payload.error || "Unable to load dashboard products.");
        if (active) setProducts(Array.isArray(payload.data) ? payload.data : []);
      } catch (error) { if (active) setProductsError(error instanceof Error ? error.message : "Unable to load dashboard products."); }
      finally { if (active) setProductsLoading(false); }
    }
    loadProducts();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (draftId) {
        const draft = getDraftOrder(draftId);
        if (draft) { setItems(draft.items); setCustomerName(draft.customerName); setCustomerEmail(draft.customerEmail); setNote(draft.note); setTags(draft.tags); }
      }
      setDraftReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [draftId]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0), [items]);
  const totalQuantity = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  function addProducts(selectedProducts: DashboardProduct[]) { setItems((current) => selectedProducts.reduce((next, product) => { const index = next.findIndex((item) => item.productId === product.id); if (index >= 0) { const updated = [...next]; updated[index] = { ...updated[index], quantity: updated[index].quantity + 1 }; return updated; } return [...next, { id: product.id, productId: product.id, name: product.name, image: product.mainImage || undefined, category: productCategory(product), quantity: 1, unitPrice: priceToNumber(product.price) }]; }, current)); }
  function changeQuantity(id: string, difference: number) { setItems((current) => current.flatMap((item) => item.id === id ? (item.quantity + difference <= 0 ? [] : [{ ...item, quantity: item.quantity + difference }]) : [item])); }
  function removeItem(id: string) { setItems((current) => current.filter((item) => item.id !== id)); }
  function saveDraft() { if (items.length === 0) return; saveDraftOrder({ id: draftId || undefined, customerName: customerName.trim(), customerEmail: customerEmail.trim(), note: note.trim(), tags: tags.trim(), items }); router.push("/dashboard/orders/drafts"); }

  return <TooltipProvider><SidebarProvider className="min-h-svh"><AppSidebar /><SidebarInset><main className="min-h-full flex-1 bg-[#f5f5f5] p-4 text-black sm:p-5"><header className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="flex items-center gap-2 text-lg font-semibold"><ClipboardPenLine className="size-4" />{draftId ? "Edit draft order" : "Create draft order"}</h1><p className="mt-1 text-xs text-black/55">Add dashboard products, customer details, and save the order as a draft.</p></div><div className="flex items-center gap-2"><Link href="/dashboard/orders/drafts" className="inline-flex h-8 items-center rounded-lg bg-black/[0.06] px-3 text-xs font-medium hover:bg-black/10">Discard</Link><button type="button" disabled={items.length === 0 || !draftReady} onClick={saveDraft} className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black px-3 text-xs font-semibold text-white hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-black/15"><Save className="size-3.5" />Save draft</button></div></header><div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]"><div className="space-y-4"><Card title="Products" action={<button type="button" onClick={() => setPickerOpen(true)} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/15 px-3 text-xs font-medium hover:bg-black/[0.03]"><Plus className="size-3.5" />Add product</button>}>{items.length === 0 ? <div className="rounded-lg border border-dashed border-black/15 px-5 py-12 text-center"><PackagePlus className="mx-auto size-7 text-black/30" /><p className="mt-3 text-sm font-medium">No products added</p><p className="mt-1 text-xs text-black/55">Add products from your dashboard to start this draft order.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="text-xs text-black/55"><tr><th className="border-b border-black/10 pb-2.5 font-medium">Product</th><th className="border-b border-black/10 pb-2.5 font-medium">Quantity</th><th className="border-b border-black/10 pb-2.5 text-right font-medium">Price</th><th className="w-10 border-b border-black/10 pb-2.5" /></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td className="border-b border-black/10 py-3"><p className="font-medium">{item.name}</p><p className="mt-0.5 text-xs text-black/50">{item.category || "Dashboard product"}</p></td><td className="border-b border-black/10 py-3"><div className="inline-flex h-8 items-center overflow-hidden rounded-lg border border-black/15"><button type="button" onClick={() => changeQuantity(item.id, -1)} aria-label={`Decrease ${item.name} quantity`} className="grid size-8 place-items-center hover:bg-black/[0.04]"><Minus className="size-3.5" /></button><span className="w-7 text-center text-xs font-medium">{item.quantity}</span><button type="button" onClick={() => changeQuantity(item.id, 1)} aria-label={`Increase ${item.name} quantity`} className="grid size-8 place-items-center hover:bg-black/[0.04]"><Plus className="size-3.5" /></button></div></td><td className="border-b border-black/10 py-3 text-right font-medium">{formatINR(item.unitPrice * item.quantity)}</td><td className="border-b border-black/10 py-3 text-right"><button type="button" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`} className="rounded-md p-1.5 text-black/45 hover:bg-red-50 hover:text-red-600"><Trash2 className="size-4" /></button></td></tr>)}</tbody></table></div>}<div className="mt-4 ml-auto grid max-w-sm grid-cols-[1fr_auto] gap-x-5 gap-y-2 border-t border-black/10 pt-4 text-sm"><span className="text-black/65">Subtotal</span><span className="text-right">{formatINR(subtotal)}</span><span className="font-semibold">Total</span><span className="text-right font-semibold">{formatINR(subtotal)}</span></div></Card><Card title="Notes"><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} placeholder="Add a note for this draft order" className="w-full resize-y rounded-lg border border-black/20 p-3 text-sm outline-none placeholder:text-black/35 focus:border-black/50" /></Card></div><aside className="space-y-4"><Card title="Customer"><label className="grid gap-1.5 text-sm font-medium text-black/75">Customer name<input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Optional" className="h-10 rounded-lg border border-black/20 px-3 font-normal outline-none placeholder:text-black/35 focus:border-black/50" /></label><label className="mt-3 grid gap-1.5 text-sm font-medium text-black/75">Email address<input value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} type="email" placeholder="Optional" className="h-10 rounded-lg border border-black/20 px-3 font-normal outline-none placeholder:text-black/35 focus:border-black/50" /></label></Card><Card title="Order summary"><dl className="space-y-3 text-sm"><div className="flex justify-between gap-3"><dt className="text-black/60">Products</dt><dd>{items.length}</dd></div><div className="flex justify-between gap-3"><dt className="text-black/60">Units</dt><dd>{totalQuantity}</dd></div><div className="flex justify-between gap-3 border-t border-black/10 pt-3 font-semibold"><dt>Total</dt><dd>{formatINR(subtotal)}</dd></div></dl></Card><Card title="Tags"><label className="flex h-10 items-center gap-2 rounded-lg border border-black/20 px-3 text-sm text-black/55"><UserRound className="size-4" /><input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="e.g. phone order" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-black/35" /></label></Card>{productsError ? <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">{productsError}</p> : null}{productsLoading ? <p className="text-xs text-black/50">Loading dashboard products…</p> : null}</aside></div></main><ProductPicker open={pickerOpen} onOpenChange={setPickerOpen} products={products} onAdd={addProducts} /></SidebarInset></SidebarProvider></TooltipProvider>;
}
