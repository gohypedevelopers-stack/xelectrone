import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import * as discountsController from "@/lib/server/controllers/discounts.controller";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await discountsController.deleteDiscount(id);
    revalidatePath("/dashboard/discounts");
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
