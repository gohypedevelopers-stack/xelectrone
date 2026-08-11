import type { DiscountType } from "@prisma/client";

import * as discountsDal from "@/lib/server/dal/discounts.dal";

type CreateDiscountInput = {
  code?: string | null;
  type?: DiscountType;
  value?: number;
};

export function listDiscounts() {
  return discountsDal.getAllDiscounts();
}

export async function createDiscount(input: CreateDiscountInput) {
  const code = input.code?.trim().toUpperCase() || null;
  const value = Number(input.value);

  if (!input.type || !Number.isFinite(value) || value <= 0) {
    throw new Error("Enter a valid discount value");
  }
  if (input.type === "PERCENTAGE" && value > 100) {
    throw new Error("Percentage discounts cannot exceed 100%");
  }
  if (code) {
    const existing = await discountsDal.getDiscountByCode(code);
    if (existing) throw new Error("This discount code already exists");
  }

  return discountsDal.createDiscount({ code, type: input.type, value });
}

export function deleteDiscount(id: string) {
  return discountsDal.deleteDiscount(id);
}
