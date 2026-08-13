"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  PlusIcon,
  Trash2Icon,
  PencilIcon,
  EyeIcon,
  EyeOffIcon,
  UploadIcon,
  Loader2Icon,
  XIcon,
  VideoIcon,
  ExternalLinkIcon,
  SearchIcon,
  CheckIcon,
} from "lucide-react"
import { toast } from "sonner"
import type { CreatorVideoItem } from "@/lib/server/controllers/creator-videos.controller"
import { uploadProductImage } from "@/lib/client/upload-product-image"

type ProductOption = {
  id: string
  name: string
  slug: string
  mainImage: string
  price?: string
  category?: string
}

function ProductSelectPicker({
  products,
  selectedId,
  onSelect,
}: {
  products: ProductOption[]
  selectedId: string
  onSelect: (productId: string) => void
}) {
  const [isSelecting, setIsSelecting] = useState(false)
  const [search, setSearch] = useState("")

  const selectedProduct = products.find((p) => p.id === selectedId)

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
  )

  if (!isSelecting && selectedProduct) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-black/15 bg-slate-50 p-2.5 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0 border border-black/10">
            <Image
              src={selectedProduct.mainImage}
              alt={selectedProduct.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-black truncate text-xs">{selectedProduct.name}</p>
            <div className="flex items-center gap-2 text-[10px] text-black/50 mt-0.5">
              {selectedProduct.price && <span>₹{selectedProduct.price}</span>}
              {selectedProduct.category && <span>• {selectedProduct.category}</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          <button
            type="button"
            onClick={() => setIsSelecting(true)}
            className="px-2.5 py-1 text-[11px] font-semibold text-black bg-white border border-black/15 rounded-lg hover:bg-black hover:text-white transition cursor-pointer"
          >
            Change
          </button>
          <button
            type="button"
            onClick={() => onSelect("")}
            className="p-1 text-black/40 hover:text-rose-600 transition cursor-pointer"
            title="Remove product link"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  if (!isSelecting && !selectedProduct) {
    return (
      <button
        type="button"
        onClick={() => setIsSelecting(true)}
        className="w-full flex items-center justify-between rounded-xl border border-dashed border-black/25 bg-slate-50/50 p-3 text-xs text-black/60 hover:text-black hover:border-black hover:bg-slate-100/50 transition cursor-pointer"
      >
        <div className="flex items-center gap-2 font-semibold">
          <PlusIcon className="w-4 h-4 text-black/40" />
          <span>Link a Product to this Video</span>
        </div>
        <span className="text-[10px] text-black/40 bg-white px-2 py-0.5 rounded-md border border-black/10">Optional</span>
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-black/15 bg-white p-3 space-y-2.5 shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-black/10 pb-2">
        <span className="font-semibold text-black text-xs">Select Product to Link</span>
        <button
          type="button"
          onClick={() => setIsSelecting(false)}
          className="text-black/40 hover:text-black text-[11px] font-medium cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-black/40" />
        <input
          type="text"
          autoFocus
          placeholder="Search products by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-black/15 bg-slate-50 pl-8 pr-3 py-1.5 text-xs outline-none focus:border-black focus:bg-white transition"
        />
      </div>

      {/* Scrollable Product List */}
      <div
        onWheel={(e) => e.stopPropagation()}
        onScroll={(e) => e.stopPropagation()}
        className="overflow-y-auto max-h-48 space-y-1 pr-1 divide-y divide-black/5 touch-pan-y overscroll-contain"
      >
        <button
          type="button"
          onClick={() => {
            onSelect("")
            setIsSelecting(false)
          }}
          className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium transition text-left cursor-pointer ${
            !selectedId ? "bg-black/5 font-semibold text-black" : "text-black/60 hover:bg-slate-50"
          }`}
        >
          <span>No product linked</span>
          {!selectedId && <CheckIcon className="w-4 h-4 text-black shrink-0" />}
        </button>

        {filteredProducts.map((p) => {
          const isSelected = p.id === selectedId
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                onSelect(p.id)
                setIsSelecting(false)
              }}
              className={`w-full flex items-center gap-3 p-2 rounded-lg text-xs transition text-left cursor-pointer ${
                isSelected ? "bg-black text-white" : "hover:bg-slate-100 text-black"
              }`}
            >
              <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-black/10">
                <Image src={p.mainImage} alt={p.name} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate leading-tight">{p.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {p.price && (
                    <span className={isSelected ? "text-white/80 text-[10px]" : "text-black/60 text-[10px]"}>
                      ₹{p.price}
                    </span>
                  )}
                  {p.category && (
                    <span className={isSelected ? "text-white/60 text-[10px]" : "text-black/40 text-[10px]"}>
                      • {p.category}
                    </span>
                  )}
                </div>
              </div>
              {isSelected && <CheckIcon className="w-4 h-4 text-white shrink-0" />}
            </button>
          )
        })}

        {filteredProducts.length === 0 && (
          <div className="py-4 text-center text-xs text-black/40">No matching products found</div>
        )}
      </div>
    </div>
  )
}

export function CreatorVideoManager({
  initialVideos,
}: {
  initialVideos: CreatorVideoItem[]
}) {
  const [videos, setVideos] = useState<CreatorVideoItem[]>(initialVideos)
  const [products, setProducts] = useState<ProductOption[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<CreatorVideoItem | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Sync / fetch videos
  useEffect(() => {
    if (initialVideos && initialVideos.length > 0) {
      setVideos(initialVideos)
    } else {
      fetch("/api/admin/creator-videos")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setVideos(data)
        })
        .catch(() => {})
    }
  }, [initialVideos])

  // Fetch product options for dropdown
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setProducts(
            json.data.map((p: any) => ({
              id: p.id,
              name: p.name,
              slug: p.slug,
              mainImage: p.mainImage || "/category-smartphone.png",
              price: p.price,
              category: typeof p.category === "string" ? p.category : p.category?.title,
            }))
          )
        }
      })
      .catch(() => {})
  }, [])

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    thumbnailUrl: "",
    videoUrl: "",
    productId: "",
    sortOrder: 0,
    isActive: true,
  })

  function openAddModal() {
    setEditingVideo(null)
    setFormData({
      title: "",
      thumbnailUrl: "",
      videoUrl: "",
      productId: "",
      sortOrder: videos.length,
      isActive: true,
    })
    setIsModalOpen(true)
  }

  function openEditModal(item: CreatorVideoItem) {
    setEditingVideo(item)
    setFormData({
      title: item.title || "",
      thumbnailUrl: item.thumbnailUrl,
      videoUrl: item.videoUrl || "",
      productId: item.productId || "",
      sortOrder: item.sortOrder,
      isActive: item.isActive,
    })
    setIsModalOpen(true)
  }

  async function handleToggleActive(item: CreatorVideoItem) {
    const newStatus = !item.isActive
    setVideos((prev) =>
      prev.map((v) => (v.id === item.id ? { ...v, isActive: newStatus } : v))
    )

    try {
      const res = await fetch(`/api/admin/creator-videos/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      })
      if (!res.ok) throw new Error("Failed to update status")
      toast.success(newStatus ? "Video enabled" : "Video disabled")
    } catch {
      toast.error("Failed to update video status")
      setVideos((prev) =>
        prev.map((v) => (v.id === item.id ? { ...v, isActive: item.isActive } : v))
      )
    }
  }

  async function handleDelete(id: string) {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/creator-videos/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete video")
      setVideos((prev) => prev.filter((v) => v.id !== id))
      toast.success("Creator video deleted")
    } catch {
      toast.error("Failed to delete creator video")
    } finally {
      setIsSubmitting(false)
      setDeleteTargetId(null)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const uploadedResult = await uploadProductImage(file)
      setFormData((prev) => ({ ...prev, thumbnailUrl: uploadedResult.url }))
      toast.success("Thumbnail uploaded")
    } catch {
      toast.error("Failed to upload thumbnail")
    } finally {
      setIsUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.thumbnailUrl) {
      toast.error("Thumbnail image is required")
      return
    }

    setIsSubmitting(true)
    try {
      if (editingVideo) {
        // Update
        const res = await fetch(`/api/admin/creator-videos/${editingVideo.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.error || "Failed to update creator video")
        }
        const updated = await res.json()
        setVideos((prev) => prev.map((v) => (v.id === editingVideo.id ? updated : v)))
        toast.success("Creator video updated!")
      } else {
        // Create
        const res = await fetch("/api/admin/creator-videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.error || "Failed to create creator video")
        }
        const created = await res.json()
        setVideos((prev) => [...prev, created])
        toast.success("Creator video added successfully!")
      }
      setIsModalOpen(false)
    } catch (err: any) {
      toast.error(err.message || "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black flex items-center gap-2">
            <VideoIcon className="w-6 h-6 text-black/70" />
            Approved by Creators Videos
          </h1>
          <p className="text-xs text-black/60 mt-1">
            Manage creator video cards on homepage. Attach products so clicking a video opens the product page.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-black/80 shadow-xs cursor-pointer"
        >
          <PlusIcon className="w-4 h-4" />
          Add Creator Video
        </button>
      </div>

      {/* Grid */}
      {videos.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-black/10 rounded-2xl bg-black/[0.02]">
          <VideoIcon className="w-12 h-12 text-black/20 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-black/80">No Creator Videos Found</h3>
          <p className="text-xs text-black/50 mt-1 max-w-sm mx-auto">
            Add videos to showcase product demonstrations from creators on your store homepage.
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-black/80 transition cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            Add First Video
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((vid) => (
            <div
              key={vid.id}
              className={`group relative bg-white border rounded-2xl overflow-hidden shadow-xs transition-all duration-200 hover:shadow-md ${
                !vid.isActive ? "opacity-60 border-dashed border-black/20" : "border-black/10"
              }`}
            >
              {/* Card Image Container (9:16 aspect ratio) */}
              <div className="relative aspect-[9/16] w-full bg-slate-900 overflow-hidden">
                <Image
                  src={vid.thumbnailUrl}
                  alt={vid.title || "Creator Video"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                {/* Play Icon Badge */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-white/40 bg-white/25 text-white backdrop-blur-md flex items-center justify-center">
                    <VideoIcon className="w-5 h-5 ml-0.5" />
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
                    Order: {vid.sortOrder}
                  </span>

                  <button
                    onClick={() => handleToggleActive(vid)}
                    title={vid.isActive ? "Click to disable" : "Click to enable"}
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md transition cursor-pointer ${
                      vid.isActive
                        ? "bg-emerald-500/90 text-white"
                        : "bg-amber-500/90 text-white"
                    }`}
                  >
                    {vid.isActive ? <EyeIcon className="w-3 h-3" /> : <EyeOffIcon className="w-3 h-3" />}
                    {vid.isActive ? "Active" : "Hidden"}
                  </button>
                </div>

                {/* Product Badge at Bottom */}
                {vid.product && (
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 text-black p-2.5 rounded-xl shadow-lg flex items-center gap-2.5">
                    <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                      <Image
                        src={vid.product.mainImage}
                        alt={vid.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold text-black/50 uppercase tracking-wider">Linked Product</p>
                      <p className="text-xs font-semibold text-black truncate">{vid.product.name}</p>
                    </div>
                    <Link
                      href={`/product/${vid.product.slug}`}
                      target="_blank"
                      className="text-black/60 hover:text-black shrink-0"
                    >
                      <ExternalLinkIcon className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Card Footer Info & Controls */}
              <div className="p-4 bg-white border-t border-black/5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-black truncate">
                    {vid.title || "Untitled Video"}
                  </h4>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEditModal(vid)}
                    className="p-1.5 rounded-lg text-black/60 hover:text-black hover:bg-black/5 transition cursor-pointer"
                    title="Edit video"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(vid.id)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Delete video"
                  >
                    <Trash2Icon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <h3 className="text-base font-bold text-black flex items-center gap-2">
                <VideoIcon className="w-5 h-5" />
                {editingVideo ? "Edit Creator Video" : "Add New Creator Video"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-black/40 hover:text-black p-1 rounded-lg transition cursor-pointer"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block font-semibold text-black/80 mb-1">Video Title / Caption</label>
                <input
                  type="text"
                  placeholder="e.g. Earbuds Unboxing & Real Review"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-black/20 px-3 py-2 text-xs outline-none focus:border-black"
                />
              </div>

              {/* Thumbnail Image URL / Upload */}
              <div>
                <label className="block font-semibold text-black/80 mb-1">
                  Thumbnail Image (URL or Upload) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="/creator-earbuds.png or https://..."
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    className="flex-1 rounded-lg border border-black/20 px-3 py-2 text-xs outline-none focus:border-black"
                  />
                  <label className="inline-flex items-center gap-1.5 rounded-lg border border-black/20 bg-slate-50 px-3 py-2 font-semibold text-black hover:bg-slate-100 transition cursor-pointer">
                    {isUploading ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <UploadIcon className="w-4 h-4" />}
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
                {formData.thumbnailUrl && (
                  <div className="mt-2 relative h-36 w-24 rounded-lg overflow-hidden border border-black/10 bg-slate-900">
                    <Image
                      src={formData.thumbnailUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Custom Sleek Inline Product Select Picker with Thumbnail Images */}
              <div>
                <label className="block font-semibold text-black/80 mb-1">
                  Link Product (Opens product page when user clicks video)
                </label>
                <ProductSelectPicker
                  products={products}
                  selectedId={formData.productId}
                  onSelect={(id) => setFormData({ ...formData, productId: id })}
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-black/20 px-4 py-2 text-xs font-semibold text-black hover:bg-black/5 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-black/80 transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting && <Loader2Icon className="w-4 h-4 animate-spin" />}
                  {editingVideo ? "Save Changes" : "Create Video"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-black">Delete Creator Video</h3>
            <p className="text-xs text-black/60">
              Are you sure you want to delete this creator video card? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="rounded-lg border border-black/20 px-4 py-2 text-xs font-semibold text-black hover:bg-black/5 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTargetId)}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting && <Loader2Icon className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
