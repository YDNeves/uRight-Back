import { prisma } from "../lib/prisma";
import { logger } from "../config/logger";

export class PaymentService {
  async createPayment(data: {
    memberId: string;
    amount: number;
    method: string;
  }) {
    try {
      // Validar membro
      const member = await prisma.member.findUnique({ where: { id: data.memberId } });
      if (!member) throw new Error("Membro não encontrado.");

      // Criar pagamento
      const payment = await prisma.payment.create({
        data: {
          ...data,
          status: "PENDING",
        },
      });

      logger.info(`Pagamento criado: ${payment.id}`);
      return payment;
    } catch (error:any) {
      logger.error("Erro ao criar pagamento:", error);
      throw error;
    }
  }

  async getPayments() {
    return prisma.payment.findMany({
      include: {
        member: {
          include: {
            user: { select: { name: true, email: true } },
            association: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getPaymentById(id: string) {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        member: {
          include: {
            user: true,
            association: true,
          },
        },
      },
    });

    if (!payment) throw new Error("Pagamento não encontrado.");
    return payment;
  }

  async updateStatus(id: string, status: "PAID" | "FAILED" | "PENDING") {
    try {
      const updated = await prisma.payment.update({
        where: { id },
        data: { status },
      });
      logger.info(`Status do pagamento atualizado: ${id} -> ${status}`);
      return updated;
    } catch (error:any) {
      logger.error("Erro ao atualizar pagamento:", error);
      throw error;
    }
  }

  async deletePayment(id: string) {
    try {
      await prisma.payment.delete({ where: { id } });
      logger.info(`Pagamento removido: ${id}`);
      return { message: "Pagamento removido com sucesso." };
    } catch (error:any) {
      logger.error("Erro ao remover pagamento:", error);
      throw error;
    }
  }
}
