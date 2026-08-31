import * as productsDal from "@/lib/server/dal/products.dal";
import type { CreateProductInput } from "@/lib/server/dal/products.dal";
import { parsePriceNumber } from "@/lib/format-price";

const NAVBAR_PRODUCT_LIMIT = 2;
const WARRANTY_MENU_PRODUCT_LIMIT = 2;

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

  if (data.showInNavbar) {
    const navbarProductCount = await productsDal.countNavbarProducts();
    if (navbarProductCount >= NAVBAR_PRODUCT_LIMIT) {
      throw new Error(`A maximum of ${NAVBAR_PRODUCT_LIMIT} products can appear in the navigation menu.`);
    }
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

  if (data.showInNavbar && !existing.showInNavbar) {
    const navbarProductCount = await productsDal.countNavbarProducts(existing.id);
    if (navbarProductCount >= NAVBAR_PRODUCT_LIMIT) {
      throw new Error(`A maximum of ${NAVBAR_PRODUCT_LIMIT} products can appear in the navigation menu.`);
    }
  }

  if (data.showInWarrantyMenu && !existing.showInWarrantyMenu) {
    const warrantyProductCount = await productsDal.countWarrantyMenuProducts(existing.id);
    if (warrantyProductCount >= WARRANTY_MENU_PRODUCT_LIMIT) {
      throw new Error(`A maximum of ${WARRANTY_MENU_PRODUCT_LIMIT} products can appear in the warranty menu.`);
    }
  }

  return productsDal.updateProduct(existing.id, data);
}

export async function setProductNavbarPlacement(id: string, showInNavbar: boolean) {
  const existing = await productsDal.getProductNavbarPlacement(id);
  if (!existing) {
    throw new Error("Product not found");
  }

  if (showInNavbar && !existing.showInNavbar) {
    const navbarProductCount = await productsDal.countNavbarProducts(existing.id);
    if (navbarProductCount >= NAVBAR_PRODUCT_LIMIT) {
      throw new Error(`A maximum of ${NAVBAR_PRODUCT_LIMIT} products can appear in the navigation menu.`);
    }
  }

  return productsDal.setProductNavbarPlacement(existing.id, showInNavbar);
}

export async function setProductWarrantyMenuPlacement(id: string, showInWarrantyMenu: boolean) {
  const existing = await productsDal.getProductWarrantyMenuPlacement(id);
  if (!existing) {
    throw new Error("Product not found");
  }

  if (showInWarrantyMenu && !existing.showInWarrantyMenu) {
    const warrantyProductCount = await productsDal.countWarrantyMenuProducts(existing.id);
    if (warrantyProductCount >= WARRANTY_MENU_PRODUCT_LIMIT) {
      throw new Error(`A maximum of ${WARRANTY_MENU_PRODUCT_LIMIT} products can appear in the warranty menu.`);
    }
  }

  return productsDal.setProductWarrantyMenuPlacement(existing.id, showInWarrantyMenu);
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
