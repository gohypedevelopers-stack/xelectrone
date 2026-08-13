import { db } from "@/lib/db";

// ─── Queries ─────────────────────────────────────────────────────────────────

export async function getAllProducts() {
  return db.product.findMany({
    include: {
      colors: true,
      features: true,
      specs: true,
      media: { orderBy: { sortOrder: "asc" } },
      category: { select: { id: true, title: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

/** Products explicitly chosen in the dashboard to appear in the home carousel. */
export async function getBestSellerProducts() {
  return db.product.findMany({
    where: { showInBestSellers: true },
    include: {
      colors: true,
      features: true,
      specs: true,
      media: { orderBy: { sortOrder: "asc" } },
      category: { select: { id: true, title: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductById(id: string) {
  return db.product.findUnique({
    where: { id },
    include: {
      colors: true,
      features: true,
      specs: true,
      media: { orderBy: { sortOrder: "asc" } },
      category: { select: { id: true, title: true, slug: true } },
    },
  });
}

export async function getProductBySlug(slug: string) {
  return db.product.findUnique({
    where: { slug },
    include: {
      colors: true,
      features: true,
      specs: true,
      media: { orderBy: { sortOrder: "asc" } },
      category: { select: { id: true, title: true, slug: true } },
    },
  });
}

export async function getProductsByCategory(categorySlug: string) {
  return db.product.findMany({
    where: { category: { slug: categorySlug } },
    include: {
      colors: true,
      features: true,
      specs: true,
      media: { orderBy: { sortOrder: "asc" } },
      category: { select: { id: true, title: true, slug: true } },
    },
  });
}

export async function searchProducts(query: string) {
  return db.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    include: {
      colors: true,
      features: true,
      specs: true,
      media: { orderBy: { sortOrder: "asc" } },
      category: { select: { id: true, title: true, slug: true } },
    },
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export type CreateProductInput = {
  slug: string;
  name: string;
  categoryId: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  rating?: number;
  reviewsCount?: string;
  description: string;
  mainImage: string;
  shippingNotice: string;
  quantity?: number;
  showInBestSellers?: boolean;
  colors?: { name: string; bgHex: string; borderHex?: string }[];
  features?: string[];
  specs?: { label: string; value: string }[];
  media?: { key: string; url: string; mimeType: string; sortOrder: number }[];
};

export type UpdateProductInput = {
  slug?: string;
  name?: string;
  categoryId?: string;
  price?: string;
  oldPrice?: string | null;
  discount?: string | null;
  rating?: number;
  reviewsCount?: string;
  description?: string;
  mainImage?: string;
  shippingNotice?: string;
  quantity?: number;
  showInBestSellers?: boolean;
  /** New files to append. Existing product media is never replaced during an edit. */
  newMedia?: { key: string; url: string; mimeType: string; sortOrder: number }[];
  mediaOrder?: { id: string; sortOrder: number }[];
  /** Existing product media records to remove. */
  removeMediaIds?: string[];
};

export async function createProduct(data: CreateProductInput) {
  const { colors, features, specs, media, ...productData } = data;

  return db.product.create({
    data: {
      ...productData,
      colors: colors ? { create: colors } : undefined,
      features: features
        ? { create: features.map((f) => ({ featureText: f })) }
        : undefined,
      specs: specs ? { create: specs } : undefined,
      media: media?.length ? { create: media } : undefined,
    },
    include: {
      colors: true,
      features: true,
      specs: true,
      media: { orderBy: { sortOrder: "asc" } },
      category: { select: { id: true, title: true, slug: true } },
    },
  });
}

export async function updateProduct(
  id: string,
  data: UpdateProductInput
) {
  const { categoryId, newMedia, mediaOrder, removeMediaIds, ...productData } = data;

  const mediaChanges =
    newMedia?.length || mediaOrder?.length || removeMediaIds?.length
      ? {
          // Nested `create` appends new rows. Reordering and deletion target only this product's relation.
          create: newMedia?.length ? newMedia : undefined,
          update: mediaOrder?.length
            ? mediaOrder.map(({ id: mediaId, sortOrder }) => ({
                where: { id: mediaId },
                data: { sortOrder },
              }))
            : undefined,
          deleteMany: removeMediaIds?.length
            ? { id: { in: removeMediaIds } }
            : undefined,
        }
      : undefined;

  return db.product.update({
    where: { id },
    data: {
      ...productData,
      category: categoryId ? { connect: { id: categoryId } } : undefined,
      media: mediaChanges,
    },
    include: {
      colors: true,
      features: true,
      specs: true,
      media: { orderBy: { sortOrder: "asc" } },
      category: { select: { id: true, title: true, slug: true } },
    },
  });
}

export async function deleteProduct(id: string) {
  return db.product.delete({
    where: { id },
  });
}

export async function decrementProductStock(productId: string, quantityToDecrement: number) {
  const product = await db.product.findUnique({
    where: { id: productId },
    select: { quantity: true },
  });

  if (!product) return;

  const currentQuantity = typeof product.quantity === "number" ? product.quantity : 0;
  const newQuantity = Math.max(0, currentQuantity - quantityToDecrement);

  return db.product.update({
    where: { id: productId },
    data: { quantity: newQuantity },
  });
}

export async function countProducts() {
  return db.product.count();
}
