import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

// ─── Queries ─────────────────────────────────────────────────────────────────

export async function getAllProducts() {
  return db.product.findMany({
    include: {
      colors: true,
      features: true,
      specs: true,
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
  colors?: { name: string; bgHex: string; borderHex?: string }[];
  features?: string[];
  specs?: { label: string; value: string }[];
};

export async function createProduct(data: CreateProductInput) {
  const { colors, features, specs, ...productData } = data;

  return db.product.create({
    data: {
      ...productData,
      colors: colors ? { create: colors } : undefined,
      features: features
        ? { create: features.map((f) => ({ featureText: f })) }
        : undefined,
      specs: specs ? { create: specs } : undefined,
    },
    include: {
      colors: true,
      features: true,
      specs: true,
      category: { select: { id: true, title: true, slug: true } },
    },
  });
}

export async function updateProduct(
  id: string,
  data: Prisma.ProductUpdateInput
) {
  return db.product.update({
    where: { id },
    data,
    include: {
      colors: true,
      features: true,
      specs: true,
      category: { select: { id: true, title: true, slug: true } },
    },
  });
}

export async function deleteProduct(id: string) {
  return db.product.delete({ where: { id } });
}

export async function countProducts() {
  return db.product.count();
}
