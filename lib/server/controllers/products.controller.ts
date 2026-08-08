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
  id: string,
  data: Parameters<typeof productsDal.updateProduct>[1]
) {
  const existing = await productsDal.getProductById(id);
  if (!existing) {
    throw new Error("Product not found");
  }
  return productsDal.updateProduct(id, data);
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export async function deleteProduct(id: string) {
  const existing = await productsDal.getProductById(id);
  if (!existing) {
    throw new Error("Product not found");
  }
  return productsDal.deleteProduct(id);
}
