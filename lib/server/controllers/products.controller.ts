import * as productsDal from "@/lib/server/dal/products.dal";
import type { CreateProductInput } from "@/lib/server/dal/products.dal";
import { parsePriceNumber } from "@/lib/format-price";

// ─── Price Override Helper ───────────────────────────────────────────────────

function applyEffectivePrice(product: any) {
  if (!product) return product;
  
  let effectivePrice = product.price;
  let effectiveOldPrice = product.oldPrice;
  
  if (
    product.dealOfTheDay &&
    product.dealOfTheDay.isActive &&
    (!product.dealOfTheDay.endsAt || new Date(product.dealOfTheDay.endsAt) > new Date())
  ) {
    effectivePrice = product.dealOfTheDay.dealPrice || product.price;
    effectiveOldPrice = product.dealOfTheDay.compareAtPrice || (product.price !== effectivePrice ? product.price : product.oldPrice);
  }
  
  let discount = product.discount;
  if (effectivePrice && effectiveOldPrice && (effectivePrice !== product.price || !discount)) {
    const numPrice = parsePriceNumber(effectivePrice);
    const numOld = parsePriceNumber(effectiveOldPrice);
    if (numOld > 0 && numPrice < numOld) {
      discount = `${Math.round((1 - numPrice / numOld) * 100)}% off`;
    }
  }

  return { ...product, price: effectivePrice, oldPrice: effectiveOldPrice, discount: discount || product.discount };
}

// ─── List / Search ───────────────────────────────────────────────────────────

export async function listProducts(searchQuery?: string, categorySlug?: string) {
  let products;
  if (searchQuery) {
    products = await productsDal.searchProducts(searchQuery);
  } else if (categorySlug) {
    products = await productsDal.getProductsByCategory(categorySlug);
  } else {
    products = await productsDal.getAllProducts();
  }
  return products.map(applyEffectivePrice);
}

// ─── Get One ─────────────────────────────────────────────────────────────────

export async function getProduct(idOrSlug: string) {
  // Try by ID first, then by slug
  const byId = await productsDal.getProductById(idOrSlug);
  if (byId) return applyEffectivePrice(byId);
  const bySlug = await productsDal.getProductBySlug(idOrSlug);
  return applyEffectivePrice(bySlug);
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
