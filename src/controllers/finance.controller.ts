import { FastifyRequest, FastifyReply } from "fastify";
import { FinanceService } from "../services/finance.service";

const financeService = new FinanceService();

export class FinanceController {
  // =========================
  // CATEGORIAS FINANCEIRAS
  // =========================
  async createCategory(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { name, type, description } = request.body as any;
      const category = await financeService.createCategory(name, type, description);
      reply.status(201).send(category);
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  }

  async listCategories(_: FastifyRequest, reply: FastifyReply) {
    try {
      const categories = await financeService.listCategories();
      reply.send(categories);
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  }

  // =========================
  // TRANSAÇÕES FINANCEIRAS
  // =========================
  async createTransaction(request: FastifyRequest, reply: FastifyReply) {
    try {
      const transaction = await financeService.createTransaction(request.body as any);
      reply.status(201).send(transaction);
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  }

  async listTransactions(_: FastifyRequest, reply: FastifyReply) {
    try {
      const transactions = await financeService.listTransactions();
      reply.send(transactions);
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  }

  async getTransactionsByAssociation(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { associationId } = request.params as { associationId: string };
      const transactions = await financeService.getTransactionsByAssociation(associationId);
      reply.send(transactions);
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  }

  // =========================
  // RESUMO FINANCEIRO
  // =========================
  async getSummary(_: FastifyRequest, reply: FastifyReply) {
    try {
      const summary = await financeService.getSummary();
      reply.send(summary);
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  }

  // =========================
  // EXPORTAÇÃO DE DADOS
  // =========================
  async exportTransactions(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { format } = request.query as { format: "CSV" | "JSON" };
      const data = await financeService.exportToExternal(format || "CSV");

      if (format === "JSON") {
        reply.header("Content-Type", "application/json").send(data);
      } else {
        reply
          .header("Content-Type", "text/csv")
          .header("Content-Disposition", "attachment; filename=transactions.csv")
          .send(data);
      }
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  }
}
