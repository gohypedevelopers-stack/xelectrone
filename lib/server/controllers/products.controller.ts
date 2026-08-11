import * as productsDal from "@/lib/server/dal/products.dal";
import type { CreateProductInput } from "@/lib/server/dal/products.dal";

// ─── List / Search ───────────────────────────────────────────────────────────

export async function listProducts(searchQuery?: string, categorySlug?: string) {
  if (searchQuery) {
    return productsDal.searchProducts(searchQuery);
  }
  if (categorySlug) {
    return productsDal.getProductsByCategory(categorySlug);
  }
  return productsDal.getAllProducts();
}

// ─── Get One ─────────────────────────────────────────────────────────────────

export async function getProduct(idOrSlug: string) {
  // Try by ID first, then by slug
  const byId = await productsDal.getProductById(idOrSlug);
  if (byId) return byId;
  return productsDal.getProductBySlug(idOrSlug);
}

// ─── Create ──────────────────────────────────────────────────────────────────

export async function createProduct(data: CreateProductInput) {
  // Validate required fields
  if (!data.name || !data.slug || !data.categoryId || !data.price) {
    throw new Error("Missing required fields: name, slug, categoryId, price");
  }

  // Check if slug already exists
  const existing = await productsDal.getProductBySlug(data.slug);
  if (existing) {
    throw new Error(`Product with slug "${data.slug}" already exists`);
  }

  return productsDal.createProduct(data);
}

// ─── Update ──────────────────────────────────────────────────────────────────

export async function updateProduct(
  idOrSlug: string,
  data: Parameters<typeof productsDal.updateProduct>[1]
) {
  const existing =
    (await productsDal.getProductById(idOrSlug)) ??
    (await productsDal.getProductBySlug(idOrSlug));
  if (!existing) {
    throw new Error("Product not found");
  }

  if (data.slug && data.slug !== existing.slug) {
    const duplicate = await productsDal.getProductBySlug(data.slug);
    if (duplicate && duplicate.id !== existing.id) {
      throw new Error(`Product with slug "${data.slug}" already exists`);
    }
  }

  return productsDal.updateProduct(existing.id, data);
}

export async function listBestSellerProducts() {
  return productsDal.getBestSellerProducts();
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export async function deleteProduct(id: string) {
  const existing =
    (await productsDal.getProductById(id)) ??
    (await productsDal.getProductBySlug(id));
  if (!existing) {
    throw new Error("Product not found");
  }
  return productsDal.deleteProduct(existing.id);
}
