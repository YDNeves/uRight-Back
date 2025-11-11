import { prisma } from "../lib/prisma";
import { logger } from "../config/logger";
import { MemberStatus } from "@prisma/client";

export class MemberService {
  async create(data: {
    userId: string;
    associationId: string;
    nif?: string;
    bi?: string;
    profession?: string;
  }) {
    const existing = await prisma.member.findUnique({ where: { userId: data.userId } });
    if (existing) throw new Error("Este utilizador já possui um registo de membro.");

    const member = await prisma.member.create({
      data: {
        userId: data.userId,
        associationId: data.associationId,
        nif: data.nif,
        bi: data.bi,
        profession: data.profession,
      },
    });

    logger.info(`Membro criado: ${member.id}`);
    return member;
  }

  async getAll() {
    return prisma.member.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
        association: { select: { id: true, name: true, province: true } },
      },
      orderBy: { joinedAt: "desc" },
    });
  }

  async getById(id: string) {
    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
        association: { select: { id: true, name: true, province: true } },
        payments: true,
      },
    });
    if (!member) throw new Error("Membro não encontrado.");
    return member;
  }

  async updateStatus(id: string, status: MemberStatus) {
    const member = await prisma.member.update({
      where: { id },
      data: { status },
    });

    logger.info(`Status de membro atualizado: ${member.id} → ${status}`);
    return member;
  }

  async delete(id: string) {
    const member = await prisma.member.delete({ where: { id } });
    logger.info(`Membro removido: ${member.id}`);
    return member;
  }
}
