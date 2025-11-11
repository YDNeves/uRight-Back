import { prisma } from "../lib/prisma";
import { logger } from "../config/logger";

export class AssociationService {
  async createAssociation(data: { name: string; province: string }) {
    try {
      const association = await prisma.association.create({
        data,
      });
      return association;
    } catch (error:any) {
      logger.error("Erro ao criar associação", error);
      throw new Error("Falha ao criar associação");
    }
  }

  async getAllAssociations() {
    try {
      return await prisma.association.findMany({
        include: { members: true, payments: true },
      });
    } catch (error:any) {
      logger.error("Erro ao listar associações", error);
      throw new Error("Falha ao listar associações");
    }
  }

  async getAssociationById(id: string) {
    try {
      const association = await prisma.association.findUnique({
        where: { id },
        include: { members: true, payments: true },
      });
      if (!association) throw new Error("Associação não encontrada");
      return association;
    } catch (error:any) {
      logger.error("Erro ao buscar associação", error);
      throw error;
    }
  }

  async updateAssociation(id: string, data: { name?: string; province?: string }) {
    try {
      return await prisma.association.update({
        where: { id },
        data,
      });
    } catch (error:any) {
      logger.error("Erro ao atualizar associação", error);
      throw new Error("Falha ao atualizar associação");
    }
  }

  async deleteAssociation(id: string) {
    try {
      await prisma.association.delete({ where: { id } });
      return { message: "Associação removida com sucesso" };
    } catch (error:any) {
      logger.error("Erro ao remover associação", error);
      throw new Error("Falha ao remover associação");
    }
  }
}
