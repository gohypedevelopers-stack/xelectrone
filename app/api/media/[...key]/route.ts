import { NextResponse } from "next/server";
import { Readable } from "node:stream";

import { getProductMedia } from "@/lib/server/r2";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ key: string[] }> };

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { key } = await params;
    const object = await getProductMedia(key.join("/"));
    if (!object.Body) {
      return NextResponse.json({ success: false, error: "Media not found." }, { status: 404 });
    }

    const headers = new Headers({
      "Cache-Control": object.CacheControl || "public, max-age=31536000, immutable",
      "Content-Type": object.ContentType || "application/octet-stream",
    });
    if (object.ContentLength !== undefined) headers.set("Content-Length", String(object.ContentLength));

    return new NextResponse(Readable.toWeb(object.Body as Readable) as ReadableStream, { headers });
  } catch (error) {
    const status = error && typeof error === "object" && "$metadata" in error && (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode === 404 ? 404 : 500;
    return NextResponse.json({ success: false, error: status === 404 ? "Media not found." : "Unable to load media." }, { status });
  }
}
