"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Check,
  X,
  Sparkles,
  ExternalLink,
  Clock,
  Tag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export type BlogPostItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string;
  image: string | null;
  readTime: string | null;
  accentColor: string | null;
  isActive: boolean;
  sortOrder: number;
  publishedAt: string;
  createdAt: string;
};

export function BlogManager({ initialPosts }: { initialPosts: BlogPostItem[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPostItem[]>(initialPosts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostItem | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Insights");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("/blog-1.png");
  const [readTime, setReadTime] = useState("4 min read");
  const [accentColor, setAccentColor] = useState("#0a7ae6");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  function openCreateDialog() {
    setEditingPost(null);
    setTitle("");
    setCategory("Insights");
    setExcerpt("");
    setContent("");
    setImage("/blog-1.png");
    setReadTime("4 min read");
    setAccentColor("#0a7ae6");
    setIsActive(true);
    setSortOrder(String(posts.length));
    setError("");
    setIsDialogOpen(true);
  }

  function openEditDialog(post: BlogPostItem) {
    setEditingPost(post);
    setTitle(post.title);
    setCategory(post.category);
    setExcerpt(post.excerpt || "");
    setContent(post.content || "");
    setImage(post.image || "/blog-1.png");
    setReadTime(post.readTime || "4 min read");
    setAccentColor(post.accentColor || "#0a7ae6");
    setIsActive(post.isActive);
    setSortOrder(String(post.sortOrder ?? 0));
    setError("");
    setIsDialogOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a blog post title.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const payload = {
        title: title.trim(),
        category: category.trim() || "Insights",
        excerpt: excerpt.trim() || null,
        content: content.trim() || null,
        image: image.trim() || "/blog-1.png",
        readTime: readTime.trim() || "4 min read",
        accentColor: accentColor.trim() || "#0a7ae6",
        isActive,
        sortOrder: Number(sortOrder) || 0,
      };

      if (editingPost) {
        const res = await fetch(`/api/blog/${editingPost.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Failed to update blog post");

        setPosts((current) =>
          current.map((p) => (p.id === editingPost.id ? { ...p, ...payload } : p))
        );
      } else {
        const res = await fetch("/api/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Failed to create blog post");

        setPosts((current) => [...current, json.data]);
      }

      setIsDialogOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save blog post");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");
      setPosts((current) => current.filter((p) => p.id !== id));
      router.refresh();
    } catch (err) {
      alert("Could not delete the post");
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <BookOpen className="size-5 text-[#0a7ae6]" />
            "From our blog" Manager
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Add, edit, and organize the stories and articles featured on the homepage blog section.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateDialog}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-black px-3.5 text-xs font-semibold text-white hover:bg-black/80 transition cursor-pointer"
        >
          <Plus className="size-3.5" />
          Add new blog post
        </button>
      </header>

      {/* Blog Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition hover:shadow-md"
          >
            {/* Image Preview & Accent Tag */}
            <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
              <img
                src={post.image || "/blog-1.png"}
                alt={post.title}
                className="h-full w-full object-cover"
              />
              <span
                className="absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm"
                style={{ backgroundColor: post.accentColor || "#0a7ae6" }}
              >
                {post.category}
              </span>
              <span
                className={`absolute top-3 right-3 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  post.isActive ? "bg-emerald-100 text-emerald-800" : "bg-black/60 text-white"
                }`}
              >
                {post.isActive ? "Published" : "Draft / Hidden"}
              </span>
            </div>

            {/* Post Content */}
            <div className="flex flex-1 flex-col p-4 justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                  {post.title}
                </h2>
                <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {post.excerpt || "No excerpt provided."}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="size-3" />
                  <span>{post.readTime || "4 min read"}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditDialog(post)}
                    className="inline-flex h-7 items-center gap-1 rounded-md border border-slate-200 px-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <Pencil className="size-3" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(post.id)}
                    className="inline-flex size-7 items-center justify-center rounded-md border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}

        {posts.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-white">
            <BookOpen className="mx-auto size-8 text-slate-300" />
            <p className="mt-2 text-sm font-semibold text-slate-700">No blog posts found</p>
            <p className="mt-1 text-xs text-slate-400">Create your first blog post to feature on the homepage.</p>
            <button
              type="button"
              onClick={openCreateDialog}
              className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-lg bg-black px-3 text-xs font-medium text-white hover:bg-black/80"
            >
              <Plus className="size-3.5" /> Add post
            </button>
          </div>
        )}
      </div>

      {/* Edit / Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl">
          <DialogHeader className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <DialogTitle className="text-base font-bold text-slate-900">
              {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
            {error && (
              <p className="rounded-lg bg-red-50 border border-red-200 p-2.5 text-xs text-red-700 font-medium">
                {error}
              </p>
            )}

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Article Title *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Why XElectron Speakers Are Dominating the Market in 2026"
                className="h-9 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-black"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Category / Tag</label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Insights, Guide, Technology"
                  className="h-9 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Read Time</label>
                <input
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="e.g. 4 min read"
                  className="h-9 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Short Excerpt / Subtitle</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                placeholder="A brief summary displayed on the card preview..."
                className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Article Content (Optional)</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                placeholder="Full article content or story details..."
                className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Cover Image URL</label>
                <input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/blog-1.png or https://..."
                  className="h-9 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Badge Accent Color (HEX)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor.startsWith("#") ? accentColor : "#0a7ae6"}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="size-9 rounded-lg border border-slate-300 p-0.5 cursor-pointer"
                  />
                  <input
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    placeholder="#0a7ae6"
                    className="h-9 flex-1 rounded-lg border border-slate-300 px-3 outline-none focus:border-black font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="size-4 accent-black"
                />
                <span>Published (Show in homepage "From our blog" section)</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700">
                <span className="font-semibold">Sort order:</span>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="h-8 w-16 rounded-md border border-slate-300 px-2 text-center"
                />
              </label>
            </div>

            <DialogFooter className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="h-9 rounded-lg border border-slate-300 px-4 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="h-9 rounded-lg bg-black px-4 text-xs font-semibold text-white hover:bg-black/80 transition cursor-pointer disabled:opacity-50"
              >
                {isSaving ? "Saving..." : editingPost ? "Save changes" : "Create post"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
