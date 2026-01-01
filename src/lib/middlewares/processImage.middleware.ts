import { FastifyRequest, FastifyReply } from "fastify";
import { processImageUpload } from "./processimage";

export function processImage(folder: "users" | "associations") {
  return async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    // 1. Obter o arquivo e os campos de texto
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ error: "Nenhuma imagem enviada" });
    }

    // 2. Extrair campos de texto e colocar no body manualmente
    // O @fastify/multipart coloca campos de texto em data.fields
    const body: any = {};
    for (const key in data.fields) {
      // @ts-ignore
      body[key] = data.fields[key].value;
    }
    request.body = body; // Preenche o body para o controller usar

    // 3. Processar a imagem
    const buffer = await data.toBuffer();
    const imageUrl = await processImageUpload(
      buffer,
      data.filename,
      folder
    );

    (request as any).imageUrl = imageUrl;
  };
}