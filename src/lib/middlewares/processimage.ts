// lib/image/processImage.ts
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function processImageUpload(
  buffer: Buffer,
  originalName: string,
  folder: "users" | "associations"
): Promise<string> {
  const filename = `${randomUUID()}.webp`;

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    folder
  );

  await fs.mkdir(uploadDir, { recursive: true });

  const finalPath = path.join(uploadDir, filename);

  await sharp(buffer)
    .resize(400, 400, { fit: "cover" })
    .webp({ quality: 80 })
    .toFile(finalPath);

  return `/uploads/${folder}/${filename}`;
}
