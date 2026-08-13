"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  PlusIcon,
  Trash2Icon,
  PencilIcon,
  ImageIcon,
  EyeIcon,
  EyeOffIcon,
  UploadIcon,
  Loader2Icon,
  XIcon,
  RefreshCwIcon,
} from "lucide-react"
import { toast } from "sonner"
import type { HeroBannerItem } from "@/lib/server/controllers/banners.controller"
import { uploadProductImage } from "@/lib/client/upload-product-image"

type CategoryOption = { id: string; title: string; slug: string }

export function BannerManager({ initialBanners }: { initialBanners: HeroBannerItem[] }) {
  const [banners, setBanners] = useState<HeroBannerItem[]>(initialBanners)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<HeroBannerItem | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingDesktop, setIsUploadingDesktop] = useState(false)
  const [isUploadingMobile, setIsUploadingMobile] = useState(false)
  const [categories, setCategories] = useState<CategoryOption[]>([])

  useEffect(() => {
    if (initialBanners && initialBanners.length > 0) {
      setBanners(initialBanners)
    } else {
      fetch("/api/admin/banners")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setBanners(data)
        })
        .catch(() => {})
    }
  }, [initialBanners])

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data)
        }
      })
      .catch(() => {})
  }, [])

  async function handleRestoreDefaults() {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/admin/banners/seed", { method: "POST" })
      if (!res.ok) throw new Error("Failed to restore default banners")
      const data = await res.json()
      setBanners(data)
      toast.success("Default banners loaded successfully!")
    } catch (err) {
      console.error(err)
      toast.error("Failed to load default banners")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    caption: "",
    src: "",
    mobileSrc: "",
    alt: "",
    cta: "Shop now",
    linkUrl: "/shop",
    sortOrder: 0,
    isActive: true,
  })

  function getCategoryLinkUrl(categoryTitle: string): string {
    const cat = categories.find((c) => c.title === categoryTitle)
    return cat ? `/shop?filter=${cat.slug}` : "/shop"
  }

  function openAddModal() {
    setEditingBanner(null)
    setFormData({
      title: "",
      category: "",
      caption: "",
      src: "",
      mobileSrc: "",
      alt: "",
      cta: "Shop now",
      linkUrl: "/shop",
      sortOrder: banners.length,
      isActive: true,
    })
    setIsModalOpen(true)
  }

  function openEditModal(banner: HeroBannerItem) {
    setEditingBanner(banner)
    const resolvedLink = banner.category
      ? getCategoryLinkUrl(banner.category)
      : banner.linkUrl || "/shop"
    setFormData({
      title: banner.title,
      category: banner.category || "",
      caption: banner.caption || "",
      src: banner.src,
      mobileSrc: banner.mobileSrc || "",
      alt: banner.alt || banner.title,
      cta: banner.cta || "Shop now",
      linkUrl: resolvedLink,
      sortOrder: banner.sortOrder,
      isActive: banner.isActive,
    })
    setIsModalOpen(true)
  }

  async function handleToggleActive(banner: HeroBannerItem) {
    const newStatus = !banner.isActive
    setBanners((prev) =>
      prev.map((b) => (b.id === banner.id ? { ...b, isActive: newStatus } : b))
    )

    try {
      const res = await fetch(`/api/admin/banners/${banner.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      })

      if (!res.ok) {
        throw new Error("Failed to update status")
      }
      toast.success(`Banner ${newStatus ? "activated" : "deactivated"}`)
    } catch {
      setBanners((prev) =>
        prev.map((b) => (b.id === banner.id ? { ...b, isActive: banner.isActive } : b))
      )
      toast.error("Failed to update banner status")
    }
  }

  async function handleDelete(id: string) {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete banner")

      setBanners((prev) => prev.filter((b) => b.id !== id))
      toast.success("Banner deleted successfully")
      setDeleteTargetId(null)
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete banner")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDesktopFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingDesktop(true)
    try {
      const uploaded = await uploadProductImage(file)
      setFormData((prev) => ({ ...prev, src: uploaded.url }))
      toast.success("Desktop image uploaded successfully")
    } catch (err) {
      console.error(err)
      toast.error("Image upload failed")
    } finally {
      setIsUploadingDesktop(false)
    }
  }

  async function handleMobileFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingMobile(true)
    try {
      const uploaded = await uploadProductImage(file)
      setFormData((prev) => ({ ...prev, mobileSrc: uploaded.url }))
      toast.success("Mobile image uploaded successfully")
    } catch (err) {
      console.error(err)
      toast.error("Mobile image upload failed")
    } finally {
      setIsUploadingMobile(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error("Banner title is required")
      return
    }
    if (!formData.src.trim()) {
      toast.error("Banner Desktop Image (URL or file) is required")
      return
    }

    setIsSubmitting(true)
    try {
      if (editingBanner) {
        // Update existing banner
        const res = await fetch(`/api/admin/banners/${editingBanner.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.error || "Failed to update banner")
        }
        const updated = await res.json()

        setBanners((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))
        toast.success("Banner updated successfully")
      } else {
        // Create new banner
        const res = await fetch("/api/admin/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.error || "Failed to create banner")
        }
        const created = await res.json()

        setBanners((prev) => [...prev, created])
        toast.success("New banner added successfully")
      }
      setIsModalOpen(false)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || "Failed to save banner")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 bg-[#f6f6f6] p-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-black">Homepage Hero Banners</h1>
          <p className="mt-1 text-xs text-black/60">
            Add, preview, edit, or delete slides for the main homepage carousel slider.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-black/80"
        >
          <PlusIcon className="size-4" />
          Add New Banner
        </button>
      </div>

      {/* Banner Cards Grid */}
      {banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-white py-16 text-center shadow-xs">
          <ImageIcon className="size-10 text-black/30" />
          <h3 className="mt-3 text-sm font-semibold text-black">No hero banners created yet</h3>
          <p className="mt-1 text-xs text-black/55">Add your custom banner or load the default homepage hero banners.</p>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleRestoreDefaults}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-lg border border-black/20 bg-white px-3.5 py-1.5 text-xs font-semibold text-black shadow-xs hover:bg-black/5 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2Icon className="size-3.5 animate-spin" /> : <RefreshCwIcon className="size-3.5" />}
              Load Default Banners
            </button>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-black px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-black/80"
            >
              <PlusIcon className="size-3.5" />
              Add Custom Banner
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`group relative flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition-all hover:shadow-md ${
                !banner.isActive ? "opacity-60" : ""
              }`}
            >
              {/* Live Banner Preview Image Container */}
              <div className="relative aspect-16/9 w-full bg-slate-900 overflow-hidden">
                <Image
                  src={banner.src}
                  alt={banner.alt || banner.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Status Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      banner.isActive
                        ? "bg-emerald-500/90 text-white backdrop-blur-xs"
                        : "bg-neutral-800/90 text-neutral-300 backdrop-blur-xs"
                    }`}
                  >
                    {banner.isActive ? <EyeIcon className="size-3" /> : <EyeOffIcon className="size-3" />}
                    {banner.isActive ? "Active" : "Hidden"}
                  </span>

                  {banner.category ? (
                    <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs">
                      {banner.category}
                    </span>
                  ) : null}
                </div>

                <div className="absolute bottom-3 right-3 z-10 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
                  Order: #{banner.sortOrder}
                </div>
              </div>

              {/* Banner Details Body */}
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-sm font-bold text-black line-clamp-1">{banner.title}</h3>
                {banner.caption ? (
                  <p className="mt-1 text-xs text-black/60 line-clamp-2">{banner.caption}</p>
                ) : null}

                <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-3 text-xs">
                  <span className="truncate text-black/55" title={banner.linkUrl || "/shop"}>
                    CTA: <strong className="font-semibold text-black">{banner.cta || "Shop now"}</strong>
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(banner)}
                      title={banner.isActive ? "Deactivate banner" : "Activate banner"}
                      className="rounded-md p-1.5 text-black/60 hover:bg-black/5 hover:text-black transition-colors"
                    >
                      {banner.isActive ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditModal(banner)}
                      title="Edit banner"
                      className="rounded-md p-1.5 text-black/60 hover:bg-black/5 hover:text-black transition-colors"
                    >
                      <PencilIcon className="size-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTargetId(banner.id)}
                      title="Delete banner"
                      className="rounded-md p-1.5 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2Icon className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Banner Modal */}
      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl border border-black/10 bg-white p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <h2 className="text-base font-bold text-black">
                {editingBanner ? "Edit Hero Banner" : "Add New Hero Banner"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-md p-1 text-black/50 hover:bg-black/5 hover:text-black"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              {/* Banner Title */}
              <div>
                <label className="block font-semibold text-black/80">Banner Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. XElectron Techno Android Projector"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-xs outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Category */}
                <div>
                  <label className="block font-semibold text-black/80">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const selectedTitle = e.target.value
                      const selectedCat = categories.find((c) => c.title === selectedTitle)
                      setFormData({
                        ...formData,
                        category: selectedTitle,
                        linkUrl: selectedCat ? `/shop?filter=${selectedCat.slug}` : "/shop",
                      })
                    }}
                    className="mt-1 w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-xs outline-none focus:border-black"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.title}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* CTA Button Text */}
                <div>
                  <label className="block font-semibold text-black/80">CTA Button Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Shop now, Explore now"
                    value={formData.cta}
                    onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-xs outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block font-semibold text-black/80">Subtitle / Caption</label>
                <input
                  type="text"
                  placeholder="e.g. Projection Made Simple • Full HD 1080p"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-xs outline-none focus:border-black"
                />
              </div>

              {/* Desktop Image Upload or URL */}
              <div>
                <label className="block font-semibold text-black/80">Desktop Image (URL or Upload) *</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="/hero-banner-techno-projector.png or https://..."
                    value={formData.src}
                    onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                    className="w-full rounded-lg border border-black/20 px-3 py-2 text-xs outline-none focus:border-black"
                  />
                  <label className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-black/20 bg-neutral-100 px-3 py-2 text-xs font-semibold text-black transition-colors hover:bg-neutral-200">
                    {isUploadingDesktop ? <Loader2Icon className="size-3.5 animate-spin" /> : <UploadIcon className="size-3.5" />}
                    Upload
                    <input type="file" accept="image/*" className="hidden" onChange={handleDesktopFileUpload} />
                  </label>
                </div>
                {formData.src ? (
                  <div className="relative mt-2 h-24 w-full rounded-lg bg-slate-900 overflow-hidden border border-black/10">
                    <Image src={formData.src} alt="Desktop Preview" fill className="object-cover" />
                  </div>
                ) : null}
              </div>

              {/* Mobile Image Upload or URL */}
              <div>
                <label className="block font-semibold text-black/80">Mobile Image (Optional)</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Optional mobile image path or URL"
                    value={formData.mobileSrc}
                    onChange={(e) => setFormData({ ...formData, mobileSrc: e.target.value })}
                    className="w-full rounded-lg border border-black/20 px-3 py-2 text-xs outline-none focus:border-black"
                  />
                  <label className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-black/20 bg-neutral-100 px-3 py-2 text-xs font-semibold text-black transition-colors hover:bg-neutral-200">
                    {isUploadingMobile ? <Loader2Icon className="size-3.5 animate-spin" /> : <UploadIcon className="size-3.5" />}
                    Upload
                    <input type="file" accept="image/*" className="hidden" onChange={handleMobileFileUpload} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Link URL */}
                <div>
                  <label className="block font-semibold text-black/80">Link Target URL</label>
                  <input
                    type="text"
                    placeholder="/shop or /product/techno-projector"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-xs outline-none focus:border-black"
                  />
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block font-semibold text-black/80">Display Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 0 })}
                    className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-xs outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Is Active Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="size-4 accent-black rounded"
                />
                <label htmlFor="isActiveToggle" className="font-semibold text-black/80 cursor-pointer select-none">
                  Display this banner on homepage
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 border-t border-black/10 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-black/20 px-4 py-2 text-xs font-semibold text-black hover:bg-black/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-black/80 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2Icon className="size-3.5 animate-spin" /> : null}
                  {editingBanner ? "Save Changes" : "Create Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Delete Confirmation Modal */}
      {deleteTargetId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-xl border border-black/10 bg-white p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-black">Delete Banner?</h3>
            <p className="mt-1 text-xs text-black/60">
              Are you sure you want to delete this hero banner? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="rounded-md border border-black/20 px-3 py-1.5 font-medium text-black hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleDelete(deleteTargetId)}
                className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2Icon className="size-3 animate-spin" /> : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
