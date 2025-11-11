import { FastifyInstance } from "fastify";
import { ReportsController } from "../controllers/reports.controller";
import { authenticate } from "../lib/middlewares/authenticate";

const reportsController = new ReportsController();

export async function reportsRoutes(app: FastifyInstance) {
  app.register(async (reports) => {
    reports.addHook("onRequest", authenticate);

    reports.post("/reports/general", reportsController.generateGeneralReport);
    reports.post("/reports/association/:associationId", reportsController.generateAssociationReport);
    reports.get("/reports", reportsController.listReports);
    reports.get("/reports/:id", reportsController.getReportById);
    reports.delete("/reports/:id", reportsController.deleteReport);
  });
}
