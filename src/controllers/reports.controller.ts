import { FastifyRequest, FastifyReply } from "fastify";
import fs from "fs";
import { ReportsService } from "../services/reports.service";
import { ReportsExportService } from "../services/reports.export.service";

const reportsService = new ReportsService();
const reportsExportService = new ReportsExportService();

export class ReportsController {
  async generateGeneralReport(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as { id: string };
      const report = await reportsService.generateGeneralReport(user.id);
      reply.send(report);
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  }

  async generateAssociationReport(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { associationId } = request.params as { associationId: string };
      const user = request.user as { id: string };
      const report = await reportsService.generateAssociationReport(associationId, user.id);
      reply.send(report);
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  }

  async listReports(_: FastifyRequest, reply: FastifyReply) {
    try {
      const reports = await reportsService.listReports();
      reply.send(reports);
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  }

  async getReportById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const report = await reportsService.getReportById(id);
      reply.send(report);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }

  async deleteReport(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      await reportsService.deleteReport(id);
      reply.send({ message: "Report deleted successfully" });
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  }

  async exportReportPDF(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const filePath = await reportsExportService.exportToPDF(id);
      const stream = fs.createReadStream(filePath);

      reply.header("Content-Type", "application/pdf");
      reply.header("Content-Disposition", `attachment; filename=report-${id}.pdf`);
      reply.send(stream);
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  }

  async exportReportExcel(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const filePath = await reportsExportService.exportToExcel(id);
      const stream = fs.createReadStream(filePath);

      reply.header(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      reply.header("Content-Disposition", `attachment; filename=report-${id}.xlsx`);
      reply.send(stream);
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  }
}
