import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../services/user.service";
import { logger } from "../config/logger";

const userService = new UserService();

export class UserController {
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await userService.getAll();
      return reply.send(users);
    } catch (err: any) {
      logger.error(`Erro ao listar utilizadores: ${err.message}`);
      return reply.status(500).send({ error: "Erro interno do servidor." });
    }
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const user = await userService.getById(id);
      return reply.send(user);
    } catch (err: any) {
      logger.error(`Erro ao buscar utilizador: ${err.message}`);
      return reply.status(404).send({ error: err.message });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const user = await userService.delete(id);
      return reply.send({ message: "Utilizador removido com sucesso.", user });
    } catch (err: any) {
      logger.error(`Erro ao remover utilizador: ${err.message}`);
      return reply.status(400).send({ error: err.message });
    }
  }
}
