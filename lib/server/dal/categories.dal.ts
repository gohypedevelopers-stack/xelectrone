import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

// ─── Queries ─────────────────────────────────────────────────────────────────

export async function getAllCategories() {
  return db.category.findMany({
    include: {
      _count: { select: { products: true } },
      children: { select: { id: true, title: true, slug: true } },
      products: { select: { mainImage: true }, take: 1, orderBy: { createdAt: "desc" } },
    },
    orderBy: { title: "asc" },
  });
}

export async function getCategoryById(id: string) {
  return db.category.findUnique({
    where: { id },
    include: {
      _count: { select: { products: true } },
      products: {
        include: { colors: true, features: true, specs: true },
      },
      children: true,
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  return db.category.findUnique({
    where: { slug },
    include: {
      _count: { select: { products: true } },
      products: {
        include: { colors: true, features: true, specs: true },
      },
      children: true,
    },
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export async function createCategory(
  data: Prisma.CategoryCreateInput
) {
  return db.category.create({ data });
}

export async function updateCategory(
  id: string,
  data: Prisma.CategoryUpdateInput
) {
  return db.category.update({ where: { id }, data });
}

export async function deleteCategory(id: string) {
  return db.category.delete({ where: { id } });
}
