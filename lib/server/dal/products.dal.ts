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
      dealOfTheDay: true,
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
      dealOfTheDay: true,
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
      dealOfTheDay: true,
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
      dealOfTheDay: true,
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
      dealOfTheDay: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function searchProducts(query: string) {
  const searchTerm = query.trim();
  if (!searchTerm) return [];

  return db.product.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
        { category: { title: { contains: searchTerm, mode: "insensitive" } } },
      ],
    },
    include: {
      colors: true,
      features: true,
      specs: true,
      media: { orderBy: { sortOrder: "asc" } },
      category: { select: { id: true, title: true, slug: true } },
      dealOfTheDay: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRelatedProducts(categoryId: string, excludeProductId: string, limit = 4) {
  return db.product.findMany({
    where: {
      categoryId,
      id: { not: excludeProductId },
    },
    include: {
      colors: true,
      features: true,
      specs: true,
      media: { orderBy: { sortOrder: "asc" } },
      category: { select: { id: true, title: true, slug: true } },
      dealOfTheDay: true,
    },
    take: limit,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export type CreateProductInput = {
  name: string;
  slug: string;
  categoryId: string;
  price: string;
  oldPrice?: string | null;
  discount?: string | null;
  rating?: number;
  reviewsCount?: string;
  description: string;
  mainImage: string;
  shippingNotice: string;
  quantity?: number;
  showInBestSellers?: boolean;
  colors?: { name: string; bgHex: string }[];
  features?: string[];
  specs?: { label: string; value: string }[];
  media?: { key: string; url: string; mimeType: string; sortOrder: number }[];
};

export type UpdateProductInput = Partial<CreateProductInput> & {
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
      dealOfTheDay: true,
    },
  });
}

export async function updateProduct(
  id: string,
  data: UpdateProductInput
) {
  const { categoryId, newMedia, mediaOrder, removeMediaIds, features, ...productData } = data;

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
      features: features !== undefined ? {
        deleteMany: {},
        create: features.map(f => ({ featureText: f }))
      } : undefined,
    },
    include: {
      colors: true,
      features: true,
      specs: true,
      media: { orderBy: { sortOrder: "asc" } },
      category: { select: { id: true, title: true, slug: true } },
      dealOfTheDay: true,
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
  if (!product) throw new Error("Product not found");
  if (product.quantity < quantityToDecrement) throw new Error("Insufficient stock");

  return db.product.update({
    where: { id: productId },
    data: { quantity: { decrement: quantityToDecrement } },
  });
}
