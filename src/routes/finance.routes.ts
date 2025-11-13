import { FastifyInstance } from "fastify";
import { FinanceController } from "../controllers/finance.controller";
import { authenticate } from "../lib/middlewares/authenticate";

const financeController = new FinanceController();

export async function financeRoutes(app: FastifyInstance) {
  app.register(async (finance) => {
    // Autenticação para todas as rotas de finanças
    finance.addHook("onRequest", authenticate);
    // CATEGORIAS FINANCEIRAS
    finance.post("/categories", financeController.createCategory);
    finance.get("/categories", financeController.listCategories);
    // TRANSAÇÕES FINANCEIRAS
    finance.post("/transactions", financeController.createTransaction);
    finance.get("/transactions", financeController.listTransactions);
    finance.get(
      "/transactions/association/:associationId",
      financeController.getTransactionsByAssociation
    );
    // RESUMO FINANCEIRO
    finance.get("/summary", financeController.getSummary);
    // EXPORTAÇÃO DE DADOS
    finance.get("/export", financeController.exportTransactions);
  });
}
