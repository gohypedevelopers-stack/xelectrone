import "server-only";

import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const maxProductImageSize = 10 * 1024 * 1024;
const allowedImageTypes = new Set(["image/avif", "image/gif", "image/jpeg", "image/png", "image/webp"]);

let r2Client: S3Client | undefined;

function requiredEnvironment(name: "R2_ACCOUNT_ID" | "R2_ACCESS_KEY_ID" | "R2_SECRET_ACCESS_KEY" | "R2_BUCKET_NAME") {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

export function getR2BucketName() {
  return requiredEnvironment("R2_BUCKET_NAME");
}

export function getR2Client() {
  if (r2Client) return r2Client;

  r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${requiredEnvironment("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requiredEnvironment("R2_ACCESS_KEY_ID"),
      secretAccessKey: requiredEnvironment("R2_SECRET_ACCESS_KEY"),
    },
  });
  return r2Client;
}

function safeFileName(name: string) {
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^[-.]+|[-.]+$)/g, "");
  return cleaned || "product-image";
}

export async function uploadProductImage(file: File) {
  if (!allowedImageTypes.has(file.type)) {
    throw new Error("Choose a PNG, JPG, WebP, AVIF, or GIF image.");
  }
  if (file.size === 0 || file.size > maxProductImageSize) {
    throw new Error("Product images must be between 1 byte and 10 MB.");
  }

  const key = `products/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
  await getR2Client().send(new PutObjectCommand({
    Bucket: getR2BucketName(),
    Key: key,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type,
    CacheControl: "public, max-age=31536000, immutable",
  }));

  return { key, url: `/api/media/${key}` };
}

export async function getProductMedia(key: string) {
  return getR2Client().send(new GetObjectCommand({
    Bucket: getR2BucketName(),
    Key: key,
  }));
}
