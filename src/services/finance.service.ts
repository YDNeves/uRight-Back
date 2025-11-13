import { prisma } from "../lib/prisma";
import { logger } from "../config/logger";
import { CategoryType, TransactionType, FinanceTransaction } from "@prisma/client";

export class FinanceService {
  // Criar categoria financeira
  async createCategory(name: string, type: CategoryType, description?: string) {
    const category = await prisma.financeCategory.create({
      data: { name, type, description },
    });
    logger.info(`Finance category created: ${name}`);
    return category;
  }

  // Listar categorias com transações
  async listCategories() {
    return prisma.financeCategory.findMany({
      include: { transactions: true },
      orderBy: { name: "asc" },
    });
  }

  // Criar transação financeira
  async createTransaction(data: {
    categoryId: string;
    amount: number;
    type: TransactionType;
    method: string;
    description?: string;
    associationId?: string;
  }): Promise<FinanceTransaction> {
    const transaction = await prisma.financeTransaction.create({ data });
    logger.info(`Finance transaction recorded: ${transaction.id}`);
    return transaction;
  }

  // Listar todas as transações
  async listTransactions() {
    return prisma.financeTransaction.findMany({
      include: { category: true, association: true },
      orderBy: { createdAt: "desc" },
    });
  }

  // Obter resumo financeiro geral
  async getSummary() {
    const totalIncome = await prisma.financeTransaction.aggregate({
      where: { type: "INCOME" },
      _sum: { amount: true },
    });

    const totalExpense = await prisma.financeTransaction.aggregate({
      where: { type: "EXPENSE" },
      _sum: { amount: true },
    });

    const balance = (totalIncome._sum.amount || 0) - (totalExpense._sum.amount || 0);

    return {
      totalIncome: totalIncome._sum.amount || 0,
      totalExpense: totalExpense._sum.amount || 0,
      balance,
      generatedAt: new Date(),
    };
  }

  // Obter transações de uma associação específica
  async getTransactionsByAssociation(associationId: string) {
    return prisma.financeTransaction.findMany({
      where: { associationId },
      include: { category: true, association: true },
      orderBy: { createdAt: "desc" },
    });
  }

  // Exportar transações para JSON ou CSV
  async exportToExternal(format: "CSV" | "JSON") {
    const transactions = await prisma.financeTransaction.findMany({
      include: { category: true, association: true },
    });

    if (format === "JSON") {
      return JSON.stringify(transactions, null, 2);
    }

    const headers = "ID,Category,Type,Method,Amount,Description,Association,CreatedAt\n";
    const rows = transactions
      .map(
        (t) =>
          `${t.id},${t.category.name},${t.type},${t.method},${t.amount},"${t.description || ""}",${t.association?.name || ""},${t.createdAt.toISOString()}`
      )
      .join("\n");

    return headers + rows;
  }
}
