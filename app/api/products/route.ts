import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import * as productsController from "@/lib/server/controllers/products.controller";

// GET /api/products?search=&category=
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;

    const products = await productsController.listProducts(search, category);
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/products
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const product = await productsController.createProduct(body);
    revalidatePath("/");
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("already exists") || message.includes("Missing") ? 400 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
