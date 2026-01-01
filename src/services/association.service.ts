import { prisma } from "../lib/prisma";
import { logger } from "../config/logger";

export class AssociationService {
  // Criar associação com a URL da imagem já processada pelo middleware
  async createAssociation(data: { name: string; province: string; imageUrl?: string }) {
    try {
      const association = await prisma.association.create({
        data: {
          name: data.name,
          province: data.province,
          imageUrl: data.imageUrl || "", // default string vazia se não houver imagem
        },
      });
      return association;
    } catch (error: any) {
      logger.error("Erro ao criar associação", error);
      throw new Error("Falha ao criar associação");
    }
  }

  async getAllAssociations() {
    try {
      return await prisma.association.findMany({
        select: { id: true, name: true, province: true, imageUrl: true, members: true, payments: true },
      });
    } catch (error: any) {
      logger.error("Erro ao listar associações", error);
      throw new Error("Falha ao listar associações");
    }
  }

  async getRandomAssociations(limit = 10) {
    try {
      return await prisma.association.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, province: true, imageUrl: true },
      });
    } catch (error: any) {
      logger.error("Erro ao buscar associações aleatórias", error);
      throw new Error("Falha ao buscar associações");
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
    } catch (error: any) {
      logger.error("Erro ao buscar associação", error);
      throw error;
    }
  }

  // Atualiza apenas o campo imageUrl
  async updateImageUrl(id: string, imageUrl: string) {
    try {
      const updated = await prisma.association.update({
        where: { id },
        data: { imageUrl },
        select: { id: true, name: true, imageUrl: true },
      });
      logger.info(`Imagem da associação ${updated.name} atualizada`);
      return updated;
    } catch (error: any) {
      logger.error(`Erro ao atualizar imagem da associação ${id}`, error);
      throw new Error("Falha ao atualizar imagem");
    }
  }

  async updateAssociation(id: string, data: { name?: string; province?: string; imageUrl?: string }) {
    try {
      return await prisma.association.update({
        where: { id },
        data,
      });
    } catch (error: any) {
      logger.error("Erro ao atualizar associação", error);
      throw new Error("Falha ao atualizar associação");
    }
  }

  async deleteAssociation(id: string) {
    try {
      await prisma.association.delete({ where: { id } });
      return { message: "Associação removida com sucesso" };
    } catch (error: any) {
      logger.error("Erro ao remover associação", error);
      throw new Error("Falha ao remover associação");
    }
  }
}
