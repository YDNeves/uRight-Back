import { FastifyInstance } from "fastify";
import { ReportsController } from "../controllers/reports.controller";
import { authenticate } from "../lib/middlewares/authenticate";

const reportsController = new ReportsController();

export async function reportsRoutes(app: FastifyInstance) {
  app.register(async (reports) => {
    reports.addHook("onRequest", authenticate);

    // Geração de relatórios
    reports.post("/general", reportsController.generateGeneralReport);
    reports.post("/association/:associationId", reportsController.generateAssociationReport);

    // Listagem e detalhes
    reports.get("", reportsController.listReports);
    reports.get("/:id", reportsController.getReportById);
    reports.delete("/:id", reportsController.deleteReport);

    // Exportação
    reports.get("/:id/pdf", reportsController.exportReportPDF);
    reports.get("/:id/excel", reportsController.exportReportExcel);
  });
}
