import { FastifyInstance } from "fastify";
import { FinanceController } from "../controllers/finance.controller";
import { authenticate } from "../lib/middlewares/authenticate";

const financeController = new FinanceController();

export async function financeRoutes(app: FastifyInstance) {
  app.register(async (finance) => {
    finance.addHook("onRequest", authenticate);

    finance.post("/finance/categories", financeController.createCategory);
    finance.get("/finance/categories", financeController.listCategories);

    finance.post("/finance/transactions", financeController.createTransaction);
    finance.get("/finance/transactions", financeController.listTransactions);

    finance.get("/finance/summary", financeController.getSummary);
    finance.get("/finance/export", financeController.exportTransactions);
  });
}
