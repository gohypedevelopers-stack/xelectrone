"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, ChevronRight, ExternalLink, Flame, ImagePlus, Sparkles } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { uploadProductImage } from "@/lib/client/upload-product-image";

type DealProduct = {
  id: string;
  name: string;
  slug: string;
  price: string;
  oldPrice: string | null;
  description: string;
  image: string;
};

type EditableDeal = {
  productId: string;
  title: string;
  description: string;
  image: string | null;
  dealPrice: string | null;
  compareAtPrice: string | null;
  badge: string | null;
  features: string[];
  unitsLeft: number;
  totalUnits: number;
  endsAt: string;
  isActive: boolean;
};

const inputClass = "h-9 w-full rounded-lg border border-black/25 bg-white px-3 text-sm outline-none transition focus:border-black/55 focus:ring-2 focus:ring-black/5";

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm"><div className="px-4 py-4"><h2 className="text-sm font-semibold text-black/80">{title}</h2></div><div className="border-t border-black/10 px-4 pb-4 pt-4">{children}</div></section>;
}

function toDateTimeLocal(value?: string) {
  const date = value ? new Date(value) : new Date(Date.now() + 24 * 60 * 60 * 1000);
  const timezoneOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

function productOptionLabel(product: DealProduct) {
  const maximumTitleLength = 68;
  const name = product.name.length > maximumTitleLength
    ? `${product.name.slice(0, maximumTitleLength - 1)}…`
    : product.name;

  return `${name} — ${product.price}`;
}

export function DealOfTheDayEditor({ deal, products }: { deal: EditableDeal | null; products: DealProduct[] }) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const initiallySelectedProduct = products.find((product) => product.id === deal?.productId);
  const [productId, setProductId] = useState(deal?.productId ?? "");
  const [title, setTitle] = useState(deal?.title ?? "");
  const [description, setDescription] = useState(deal?.description ?? "");
  const [image, setImage] = useState(deal?.image ?? "");
  const [dealPrice, setDealPrice] = useState(deal?.dealPrice ?? initiallySelectedProduct?.price ?? "");
  const [compareAtPrice, setCompareAtPrice] = useState(deal?.compareAtPrice ?? initiallySelectedProduct?.oldPrice ?? "");
  const [badge, setBadge] = useState(deal?.badge ?? "FLASH OFFER");
  const [featuresText, setFeaturesText] = useState(deal?.features.join(", ") ?? "");
  const [unitsLeft, setUnitsLeft] = useState(String(deal?.unitsLeft ?? ""));
  const [totalUnits, setTotalUnits] = useState(String(deal?.totalUnits ?? ""));
  const [endsAt, setEndsAt] = useState(toDateTimeLocal(deal?.endsAt));
  const [isActive, setIsActive] = useState(deal?.isActive ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const selectedProduct = useMemo(() => products.find((product) => product.id === productId), [productId, products]);
  const unitsLeftValue = Number(unitsLeft);
  const totalUnitsValue = Number(totalUnits);
  const hasValidInventory = Number.isSafeInteger(unitsLeftValue) && Number.isSafeInteger(totalUnitsValue) && unitsLeftValue >= 0 && totalUnitsValue > 0 && unitsLeftValue <= totalUnitsValue;
  const hasValidEndDate = !Number.isNaN(new Date(endsAt).getTime());
  const previewImage = image || selectedProduct?.image || "";
  const previewFeatures = featuresText.split(",").map((feature) => feature.trim()).filter(Boolean);
  const claimedPercent = hasValidInventory ? Math.round(((totalUnitsValue - unitsLeftValue) / totalUnitsValue) * 100) : 0;
  const currentFormState = { productId, title, description, image, dealPrice, compareAtPrice, badge, featuresText, unitsLeft, totalUnits, endsAt, isActive };
  const [initialFormState, setInitialFormState] = useState(currentFormState);
  const isDirty =
    currentFormState.productId !== initialFormState.productId ||
    currentFormState.title !== initialFormState.title ||
    currentFormState.description !== initialFormState.description ||
    currentFormState.image !== initialFormState.image ||
    currentFormState.dealPrice !== initialFormState.dealPrice ||
    currentFormState.compareAtPrice !== initialFormState.compareAtPrice ||
    currentFormState.badge !== initialFormState.badge ||
    currentFormState.featuresText !== initialFormState.featuresText ||
    currentFormState.unitsLeft !== initialFormState.unitsLeft ||
    currentFormState.totalUnits !== initialFormState.totalUnits ||
    currentFormState.endsAt !== initialFormState.endsAt ||
    currentFormState.isActive !== initialFormState.isActive;
  const canSave = Boolean(productId && title.trim() && description.trim() && hasValidInventory && hasValidEndDate && isDirty && !isSaving && !isUploading);

  function chooseProduct(nextProductId: string) {
    const nextProduct = products.find((product) => product.id === nextProductId);
    setProductId(nextProductId);
    if (!nextProduct) return;
    if (!title.trim()) setTitle(nextProduct.name);
    if (!description.trim()) setDescription(nextProduct.description);
    if (!dealPrice.trim()) setDealPrice(nextProduct.price);
    if (!compareAtPrice.trim() && nextProduct.oldPrice) setCompareAtPrice(nextProduct.oldPrice);
  }

  async function uploadDealImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setIsUploading(true);
    setError("");
    try {
      const uploaded = await uploadProductImage(file);
      setImage(uploaded.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload the deal image");
    } finally {
      setIsUploading(false);
    }
  }

  async function saveDeal(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave) return;
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/deal-of-the-day", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          title: title.trim(),
          description: description.trim(),
          image: image || null,
          dealPrice: dealPrice.trim() || null,
          compareAtPrice: compareAtPrice.trim() || null,
          badge: badge.trim() || null,
          features: featuresText.split(",").map((feature) => feature.trim()).filter(Boolean),
          unitsLeft: unitsLeftValue,
          totalUnits: totalUnitsValue,
          endsAt: new Date(endsAt).toISOString(),
          isActive,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not save the deal");
      setInitialFormState(currentFormState);
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save the deal");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-full flex-1 bg-[#f5f5f5] p-4 text-black sm:p-5">
      <form className="mx-auto max-w-[1050px]" onSubmit={saveDeal}>
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-1.5 text-lg font-semibold"><Flame className="size-4" /><ChevronRight className="size-4 text-black/45" /> Deal of the day</h1>
            <p className="mt-1 text-sm text-black/55">Choose the product and limited-time offer customers see on the home page.</p>
          </div>
          <div className="flex items-center gap-2"><Link href="/dashboard" className="inline-flex h-8 items-center rounded-lg bg-black/[0.06] px-3 text-xs font-medium transition hover:bg-black/10">Discard</Link><button type="submit" disabled={!canSave} className="inline-flex h-8 items-center rounded-lg bg-black px-3 text-xs font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-black/15">{isSaving ? "Saving…" : "Save deal"}</button></div>
        </header>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-4">
            <SectionCard title="Deal details">
              <div className="grid gap-4">
                <label className="grid gap-1.5 text-sm font-medium text-black/75">Product <select required value={productId} onChange={(event) => chooseProduct(event.target.value)} className={inputClass}><option value="">Select a product</option>{products.map((product) => <option key={product.id} value={product.id}>{productOptionLabel(product)}</option>)}</select></label>
                <label className="grid gap-1.5 text-sm font-medium text-black/75">Deal title <input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. BLAZE B2000" className={inputClass} /></label>
                <label className="grid gap-1.5 text-sm font-medium text-black/75">Deal description <textarea required rows={4} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe why this limited-time offer is special" className="w-full resize-none rounded-lg border border-black/25 bg-white p-3 text-sm outline-none transition focus:border-black/55 focus:ring-2 focus:ring-black/5" /></label>
                <div className="grid gap-1.5 text-sm font-medium text-black/75"><span>Deal image</span><input ref={imageInputRef} type="file" accept="image/avif,image/gif,image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => void uploadDealImage(event)} /><button type="button" disabled={isUploading} onClick={() => imageInputRef.current?.click()} className="relative flex h-52 overflow-hidden items-center justify-center rounded-lg border border-dashed border-black/30 bg-black/[0.02] text-sm text-black/60 transition hover:bg-black/[0.04] disabled:cursor-wait">{previewImage ? <><Image src={previewImage} alt="Deal preview" fill sizes="650px" className="object-cover" /><span className="relative rounded bg-white/90 px-3 py-1.5 text-xs font-semibold text-black">{isUploading ? "Uploading…" : "Replace image"}</span></> : <span className="flex flex-col items-center gap-2"><ImagePlus className="size-5" />{isUploading ? "Uploading…" : "Upload image"}</span>}</button>{image ? <button type="button" onClick={() => setImage("")} className="justify-self-start text-xs font-medium text-red-600 hover:underline">Use the product image instead</button> : <p className="text-xs font-normal text-black/55">If no custom image is uploaded, the selected product image is used.</p>}</div>
              </div>
            </SectionCard>

            <SectionCard title="Offer messaging">
              <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-1.5 text-sm font-medium text-black/75">Offer label <input value={badge} onChange={(event) => setBadge(event.target.value)} placeholder="FLASH OFFER" className={inputClass} /></label><label className="grid gap-1.5 text-sm font-medium text-black/75">Highlights <input value={featuresText} onChange={(event) => setFeaturesText(event.target.value)} placeholder="Dolby Audio, 900W, 3D surround" className={inputClass} /></label></div><p className="mt-2 text-xs text-black/55">Separate highlights with commas. They appear as labels below the deal description.</p>
            </SectionCard>

            <SectionCard title="Deal pricing">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium text-black/75">Deal price <input value={dealPrice} onChange={(event) => setDealPrice(event.target.value)} placeholder={selectedProduct?.price || "₹ 14,999"} className={inputClass} /></label>
                <label className="grid gap-1.5 text-sm font-medium text-black/75">Compare-at price <input value={compareAtPrice} onChange={(event) => setCompareAtPrice(event.target.value)} placeholder={selectedProduct?.oldPrice || "₹ 32,999"} className={inputClass} /></label>
              </div>
              <p className="mt-2 text-xs text-black/55">Deal price is shown prominently on the home page. Compare-at price appears crossed out. Leave a field empty to use the selected product&apos;s price.</p>
            </SectionCard>

            {error ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}
          </div>

          <aside className="space-y-4">
            <SectionCard title="Schedule and stock">
              <div className="space-y-4"><label className="grid gap-1.5 text-sm font-medium text-black/75">End date and time <span className="relative"><CalendarClock className="pointer-events-none absolute left-3 top-2.5 size-4 text-black/45" /><input required type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} className={`${inputClass} pl-9`} /></span></label><div className="grid grid-cols-2 gap-3"><label className="grid gap-1.5 text-sm font-medium text-black/75">Units left <input required min="0" inputMode="numeric" value={unitsLeft} onChange={(event) => setUnitsLeft(event.target.value)} placeholder="16" className={inputClass} /></label><label className="grid gap-1.5 text-sm font-medium text-black/75">Total units <input required min="1" inputMode="numeric" value={totalUnits} onChange={(event) => setTotalUnits(event.target.value)} placeholder="100" className={inputClass} /></label></div>{unitsLeft && totalUnits && !hasValidInventory ? <p className="text-xs text-red-700">Units left must be from 0 to the total units.</p> : null}<label className="flex items-center justify-between gap-3 rounded-lg border border-black/10 px-3 py-2.5 text-sm"><span><span className="block font-medium">Show on storefront</span><span className="mt-0.5 block text-xs text-black/55">Save the deal to apply this visibility change on the home page.</span></span><Switch checked={isActive} onCheckedChange={setIsActive} aria-label="Show deal on storefront" /></label></div>
            </SectionCard>
            <SectionCard title="Storefront preview">
              <p className="mb-3 text-xs leading-5 text-black/55">This is the information customers will see in the Deal of the day section on the home page.</p>
              {selectedProduct ? <div className="overflow-hidden rounded-xl border border-[#005BD3]/15 bg-[#f7fbff]">
                <div className="relative h-32 bg-slate-950">
                  {previewImage ? <Image src={previewImage} alt={title || selectedProduct.name} fill sizes="300px" className="object-cover" /> : <div className="flex h-full items-center justify-center text-xs text-white/60">No product image</div>}
                  <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white">{badge.trim() || "Deal of the day"}</span>
                </div>
                <div className="p-3.5">
                  <div className="flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-wider text-[#005BD3]"><span className="flex items-center gap-1"><Flame className="size-3 fill-current" /> {unitsLeft || "0"} units left</span><span>{hasValidEndDate ? "Limited time" : "Set an end time"}</span></div>
                  <h2 className="mt-2 line-clamp-2 text-base font-semibold leading-5 text-slate-950">{title || selectedProduct.name}</h2>
                  <p className="mt-1 line-clamp-3 text-xs leading-5 text-slate-600">{description || selectedProduct.description}</p>
                  {previewFeatures.length > 0 ? <div className="mt-3 flex flex-wrap gap-1.5">{previewFeatures.slice(0, 4).map((feature) => <span key={feature} className="rounded-full border border-[#005BD3]/25 bg-white px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#005BD3]">{feature}</span>)}</div> : null}
                  <div className="mt-3 border-t border-slate-200 pt-3"><div className="flex items-baseline gap-2"><span className="text-lg font-semibold text-slate-950">{dealPrice || selectedProduct.price}</span>{compareAtPrice || selectedProduct.oldPrice ? <span className="text-xs text-slate-400 line-through">{compareAtPrice || selectedProduct.oldPrice}</span> : null}</div><div className="mt-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide"><span className="text-[#005BD3]">Selling fast</span><span className="text-slate-500">{claimedPercent}% claimed</span></div><div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-[#005BD3] transition-all" style={{ width: `${claimedPercent}%` }} /></div></div>
                </div>
              </div> : <div className="rounded-xl border border-dashed border-black/20 bg-black/[0.02] px-4 py-8 text-center"><div className="mx-auto flex size-9 items-center justify-center rounded-lg bg-[#005BD3]/10 text-[#005BD3]"><Sparkles className="size-5" /></div><p className="mt-3 text-sm font-medium">Select a product to preview the deal</p><p className="mt-1 text-xs leading-5 text-black/55">The product image, price, and compare-at price will appear here automatically.</p></div>}
              <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-3 text-xs"><span className={isActive ? "font-medium text-emerald-700" : "font-medium text-black/50"}>{isActive ? "Will show on storefront" : "Hidden from storefront"}</span><Link href="/" className="inline-flex items-center gap-1 font-medium text-[#005BD3] hover:underline">Open home page <ExternalLink className="size-3" /></Link></div>
            </SectionCard>
          </aside>
        </div>
      </form>
    </main>
  );
}
