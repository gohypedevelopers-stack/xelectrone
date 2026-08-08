import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Pencil,
  Save,
  Tag,
  Trash2,
} from "lucide-react";

import { AppSidebar } from "@/components/admin/navigation/app-sidebar";
import { ProductAdditionalDetailsSection } from "@/components/admin/products/product-additional-details-section";
import { ProductOrganizationFields } from "@/components/admin/products/product-organization-fields";
import { ProductVariantsSection } from "@/components/admin/products/product-variants-section";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getProductById } from "@/lib/products-data";

interface ProductEditPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductEditPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  return {
    title: `${product.name} | SUOS Admin`,
    description: `Edit product details for ${product.name}`,
  };
}

const inputClass = "h-9 w-full rounded-lg border border-black/25 bg-white px-3 text-sm outline-none focus:border-black/50";
const selectClass = `${inputClass} appearance-none pr-8`;

function Card({
  title,
  children,
  actions,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm ${className}`}>
      <div className="flex items-center justify-between gap-3 px-4 py-4 border-b border-black/5">
        <h2 className="text-sm font-semibold text-black/85">{title}</h2>
        {actions}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  const storeUrl = `/product/${product.slug || product.id}`;

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main className="min-h-full flex-1 bg-[#f5f5f5] p-4 text-black sm:p-6">
            {/* Top Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/products"
                  className="inline-flex h-8 size-8 items-center justify-center rounded-lg bg-black/[0.06] text-black/70 hover:bg-black/10"
                >
                  <ArrowLeft className="size-4" />
                </Link>
                <div>
                  <h1 className="flex items-center gap-2 text-lg font-semibold text-black/90">
                    {product.name}
                  </h1>
                  <p className="text-xs text-black/50">ID: {product.id} · Category: {product.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={storeUrl}
                  target="_blank"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black/[0.06] px-3 text-xs font-medium text-black/80 hover:bg-black/10"
                >
                  <ExternalLink className="size-3.5" /> View in store
                </Link>
                <button
                  type="button"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black px-3 text-xs font-medium text-white hover:bg-black/80"
                >
                  <Save className="size-3.5" /> Save changes
                </button>
              </div>
            </div>

            {/* Main Product Edit Layout */}
            <div className="mt-2 grid gap-6 lg:grid-cols-[1fr_340px]">
              <div className="space-y-5">
                {/* Title & Description */}
                <Card title="Product Details">
                  <div className="space-y-4">
                    <label className="grid gap-1.5 text-sm font-medium text-black/75">
                      Title
                      <input
                        type="text"
                        defaultValue={product.name}
                        className={inputClass}
                      />
                    </label>
                    <label className="grid gap-1.5 text-sm font-medium text-black/75">
                      Description
                      <textarea
                        defaultValue={product.description}
                        rows={4}
                        className="w-full rounded-lg border border-black/25 bg-white p-3 text-sm outline-none focus:border-black/50"
                      />
                    </label>
                  </div>
                </Card>

                {/* Media Image Preview */}
                <Card title="Media & Image">
                  <div className="flex items-center gap-4">
                    <div className="relative size-28 shrink-0 overflow-hidden rounded-xl border border-black/10 bg-[#fafafa] p-2">
                      <Image
                        src={product.mainImage}
                        alt={product.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black/85">{product.name}</p>
                      <p className="mt-1 text-xs text-black/50">Primary Showcase Image</p>
                      <button
                        type="button"
                        className="mt-3 inline-flex h-7 items-center gap-1.5 rounded-md border border-black/15 bg-white px-2.5 text-xs font-medium text-black/75 hover:bg-black/5"
                      >
                        <Pencil className="size-3" /> Change image
                      </button>
                    </div>
                  </div>
                </Card>

                {/* Pricing & Inventory */}
                <Card title="Pricing & Inventory">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-1.5 text-sm font-medium text-black/75">
                      Price
                      <input
                        type="text"
                        defaultValue={product.price}
                        className={inputClass}
                      />
                    </label>
                    <label className="grid gap-1.5 text-sm font-medium text-black/75">
                      Compare-at price
                      <input
                        type="text"
                        defaultValue={product.oldPrice || ""}
                        placeholder="e.g. ₹9,999"
                        className={inputClass}
                      />
                    </label>
                    <label className="grid gap-1.5 text-sm font-medium text-black/75">
                      Rating
                      <input
                        type="text"
                        defaultValue={`${product.rating} / 5`}
                        className={inputClass}
                      />
                    </label>
                    <label className="grid gap-1.5 text-sm font-medium text-black/75">
                      Stock Count
                      <input
                        type="text"
                        defaultValue="80 in stock"
                        className={inputClass}
                      />
                    </label>
                  </div>
                </Card>

                {/* Variants */}
                <ProductVariantsSection />

                {/* Additional Specs & Features */}
                <ProductAdditionalDetailsSection />
              </div>

              {/* Sidebar Organization & Status */}
              <div className="space-y-5">
                <Card title="Status & Organization">
                  <div className="space-y-4">
                    <label className="grid gap-1.5 text-sm font-medium text-black/75">
                      Status
                      <span className="relative">
                        <select defaultValue="Active" className={selectClass}>
                          <option>Active</option>
                          <option>Draft</option>
                          <option>Archived</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-black/45" />
                      </span>
                    </label>

                    <label className="grid gap-1.5 text-sm font-medium text-black/75">
                      Category
                      <input
                        type="text"
                        defaultValue={product.category}
                        className={inputClass}
                      />
                    </label>
                  </div>
                </Card>

                <ProductOrganizationFields />
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
