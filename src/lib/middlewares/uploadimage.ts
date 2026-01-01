// lib/utils/uploadImage.ts
import sharp from "sharp";
import crypto from "crypto";

export async function processImageUpload(fileBuffer: Buffer, originalName: string) {
  const uniqueId = crypto.randomUUID();

  // Processamento da imagem
  const processedBuffer = await sharp(fileBuffer)
    .resize(400, 400, { fit: "cover", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  // Gerar URL simulada (ou enviar para S3/GCS/etc.)
  const filename = `${originalName}-${uniqueId}.webp`;
  const imageUrl = `https://cdn.seudominio.com/uploads/${filename}`;

  // Aqui você poderia salvar no disco ou enviar para S3
  // await fs.promises.writeFile(`./uploads/${filename}`, processedBuffer);

  return imageUrl;
}
