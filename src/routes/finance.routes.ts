import { FastifyInstance } from "fastify";
import { FinanceController } from "../controllers/finance.controller";
import { authenticate } from "../lib/middlewares/authenticate";

const financeController = new FinanceController();

export async function financeRoutes(app: FastifyInstance) {
  app.register(async (finance) => {
    finance.addHook("onRequest", authenticate);

    finance.post("/categories", financeController.createCategory);
    finance.get("/categories", financeController.listCategories);

    finance.post("/transactions", financeController.createTransaction);
    finance.get("/transactions", financeController.listTransactions);

    finance.get("/summary", financeController.getSummary);
    finance.get("/export", financeController.exportTransactions);
  });
}
