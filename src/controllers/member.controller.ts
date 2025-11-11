import { FastifyReply, FastifyRequest } from "fastify";
import { MemberService } from "../services/member.service";
import { logger } from "../config/logger";
import { MemberStatus } from "@prisma/client";

const memberService = new MemberService();

export class MemberController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = request.body as any;
      const member = await memberService.create(data);
      return reply.status(201).send(member);
    } catch (err: any) {
      logger.error(`Erro ao criar membro: ${err.message}`);
      return reply.status(400).send({ error: err.message });
    }
  }

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const members = await memberService.getAll();
      return reply.send(members);
    } catch (err: any) {
      logger.error(`Erro ao listar membros: ${err.message}`);
      return reply.status(500).send({ error: "Erro interno do servidor." });
    }
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const member = await memberService.getById(id);
      return reply.send(member);
    } catch (err: any) {
      logger.error(`Erro ao obter membro: ${err.message}`);
      return reply.status(404).send({ error: err.message });
    }
  }

  async updateStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const { status } = request.body as { status: MemberStatus };
      const member = await memberService.updateStatus(id, status);
      return reply.send(member);
    } catch (err: any) {
      logger.error(`Erro ao atualizar status: ${err.message}`);
      return reply.status(400).send({ error: err.message });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const member = await memberService.delete(id);
      return reply.send({ message: "Membro removido com sucesso.", member });
    } catch (err: any) {
      logger.error(`Erro ao remover membro: ${err.message}`);
      return reply.status(400).send({ error: err.message });
    }
  }
}
