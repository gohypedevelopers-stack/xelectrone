import { NextResponse } from "next/server";
import { getProductMedia } from "@/lib/server/r2";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ key: string[] }> };

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { key } = await params;
    const rangeHeader = request.headers.get("range") || undefined;

    const object = await getProductMedia(key.join("/"), rangeHeader);
    if (!object.Body) {
      return NextResponse.json({ success: false, error: "Media not found." }, { status: 404 });
    }

    const headers = new Headers({
      "Accept-Ranges": "bytes",
      "Cache-Control": object.CacheControl || "public, max-age=31536000, immutable",
      "Content-Type": object.ContentType || "application/octet-stream",
    });

    if (object.ContentRange) {
      headers.set("Content-Range", object.ContentRange);
    }
    if (object.ContentLength !== undefined) {
      headers.set("Content-Length", String(object.ContentLength));
    }

    const status = rangeHeader && object.ContentRange ? 206 : 200;

    // Stream the body directly for high-performance streaming without buffering 50MB in RAM
    const stream = object.Body.transformToWebStream();
    return new NextResponse(stream, {
      status,
      headers,
    });
  } catch (error) {
    const status = error && typeof error === "object" && "$metadata" in error && (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode === 404 ? 404 : 500;
    return NextResponse.json({ success: false, error: status === 404 ? "Media not found." : "Unable to load media." }, { status });
  }
}

