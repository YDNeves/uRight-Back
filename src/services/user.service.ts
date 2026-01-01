import { prisma } from "../lib/prisma";
import { logger } from "../config/logger";

export class UserService {
  async getAll() {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      // Adicionando imageUrl ao select para retornar os dados completos
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
  }

  async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      // Adicionando imageUrl ao select
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    if (!user) throw new Error("Utilizador não encontrado.");
    return user;
  }

  async delete(id: string) {
    const user = await prisma.user.delete({ where: { id } });
    logger.info(`Utilizador eliminado: ${user.email}`);
    return user;
  }
}