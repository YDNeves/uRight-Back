import { FastifyReply, FastifyRequest } from "fastify";
import { logger } from "../../config/logger";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err: any) {
    logger.warn(`Falha de autenticação: ${err.message}`);
    return reply.status(401).send({ error: "Acesso não autorizado ou token inválido." });
  }
}
