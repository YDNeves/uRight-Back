import { FastifyRequest, FastifyReply } from "fastify";
import { FinanceService } from "./finance.service";

const financeService = new FinanceService();

export class FinanceController {
  async createCategory(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { name, type, description } = request.body as any;
      const category = await financeService.createCategory(name, type, description);
      reply.send(category);
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  }

  async listCategories(_: FastifyRequest, reply: FastifyReply) {
    const categories = await financeService.listCategories();
    reply.send(categories);
  }

  async createTransaction(request: FastifyRequest, reply: FastifyReply) {
    try {
      const transaction = await financeService.createTransaction(request.body as any);
      reply.send(transaction);
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  }

  async listTransactions(_: FastifyRequest, reply: FastifyReply) {
    const transactions = await financeService.listTransactions();
    reply.send(transactions);
  }

  async getSummary(_: FastifyRequest, reply: FastifyReply) {
    const summary = await financeService.getSummary();
    reply.send(summary);
  }

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
