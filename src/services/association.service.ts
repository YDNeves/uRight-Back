import { prisma } from "../lib/prisma";
import { logger } from "../config/logger";

export class AssociationService {
  async createAssociation(data: { name: string; province: string; imageUrl?: string }) { // Adicionado imageUrl opcional
    try {
      const association = await prisma.association.create({
        data: {
          name: data.name,
          province: data.province,
          imageUrl: data.imageUrl || "", // Provide a default empty string if undefined
        },
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
        // Adicionando imageUrl ao select
        select: { id: true, name: true, province: true, imageUrl: true, members: true, payments: true },
      });
    } catch (error:any) {
      logger.error("Erro ao listar associações", error);
      throw new Error("Falha ao listar associações");
    }
  }

  async getRandomAssociations(limit = 10) {
    try {
      return await prisma.association.findMany({
        take: limit,
        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          name: true,
          province: true,
          imageUrl: true,
        },
      })
    } catch (error: any) {
      logger.error("Erro ao buscar associações aleatórias", error)
      throw new Error("Falha ao buscar associações")
    }
  }

  async getAssociationById(id: string) {
    try {
      const association = await prisma.association.findUnique({
        where: { id },
        // Incluindo membros e pagamentos, o campo imageUrl será incluído
        include: { members: true, payments: true },
      });
      if (!association) throw new Error("Associação não encontrada");
      return association;
    } catch (error:any) {
      logger.error("Erro ao buscar associação", error);
      throw error;
    }
  }

  /**
   * Atualiza o campo 'imageUrl' da associação no banco de dados.
   * @param id ID da associação.
   * @param imageUrl O URL retornado pelo middleware de upload de imagem.
   */
  async updateImageUrl(id: string, imageUrl: string) {
    try {
      const association = await prisma.association.update({
        where: { id },
        data: { imageUrl },
        select: { id: true, imageUrl: true, name: true } // Retorno mínimo de confirmação
      });
      logger.info(`URL de imagem da associação atualizada: ${association.name}`);
      return association;
    } catch (error: any) {
      logger.error(`Erro ao atualizar imageUrl da associação ${id}`, error);
      throw new Error("Falha ao atualizar a imagem da associação.");
    }
  }

  async updateAssociation(id: string, data: { name?: string; province?: string; imageUrl?: string }) { // Adicionado imageUrl opcional
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