import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "../services/auth.service";
import { logger } from "../config/logger";

const authService = new AuthService();

export class AuthController {
  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { name, email, password } = request.body as any;
      const result = await authService.register(name, email, password);
      return reply.status(201).send(result);
    } catch (err: any) {
      logger.error(`Erro no registro: ${err.message}`);
      return reply.status(400).send({ error: err.message });
    }
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, password } = request.body as any;
      const result = await authService.login(email, password);
      return reply.send(result);
    } catch (err: any) {
      logger.error(`Erro no login: ${err.message}`);
      return reply.status(401).send({ error: err.message });
    }
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user; // preenchido por request.jwtVerify()
      return reply.send({ user });
    } catch (err: any) {
      return reply.status(401).send({ error: "Token inválido." });
    }
  }
}
