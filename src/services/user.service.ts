import { prisma } from "../lib/prisma";
import { logger } from "../config/logger";

export class UserService {
  async getAll() {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      // Adicionando imageUrl ao select para retornar os dados completos
      select: { id: true, name: true, email: true, role: true, createdAt: true, imageUrl: true },
    });
  }

  async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      // Adicionando imageUrl ao select
      select: { id: true, name: true, email: true, role: true, createdAt: true, imageUrl: true },
    });
    if (!user) throw new Error("Utilizador não encontrado.");
    return user;
  }

  /**
   * Atualiza o campo 'imageUrl' do utilizador no banco de dados.
   * @param id ID do utilizador.
   * @param imageUrl O URL retornado pelo middleware de upload de imagem.
   */
  async updateImageUrl(id: string, imageUrl: string) {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: { imageUrl },
        select: { id: true, imageUrl: true, name: true } // Retorno mínimo de confirmação
      });
      logger.info(`URL de imagem do utilizador atualizada: ${user.name}`);
      return user;
    } catch (error: any) {
      logger.error(`Erro ao atualizar imageUrl do utilizador ${id}`, error);
      throw new Error("Falha ao atualizar a imagem do perfil do utilizador.");
    }
  }

  async delete(id: string) {
    const user = await prisma.user.delete({ where: { id } });
    logger.info(`Utilizador eliminado: ${user.email}`);
    return user;
  }
}