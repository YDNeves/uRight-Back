import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import { prisma } from "../lib/prisma";
import { logger } from "../config/logger";
import fs from "node:fs";
import path from "node:path";

export class ReportsExportService {
  // Gera PDF temporário e retorna o caminho do ficheiro
  async exportToPDF(reportId: string): Promise<string> {
    const report = await prisma.report.findUnique({ where: { id: reportId } });
    if (!report) throw new Error("Report not found");

    const doc = new PDFDocument({ margin: 50 });
    const filePath = path.join("/tmp", `report-${report.id}.pdf`);
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(18).text(report.title, { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Generated At: ${new Date(report.createdAt).toLocaleString()}`);
    doc.text(`Type: ${report.type}`);
    doc.moveDown();

    doc.text("Report Data:", { underline: true });
    doc.moveDown();

    const data = report.data as any;
    for (const key of Object.keys(data)) {
      doc.text(`${key}: ${data[key]}`);
    }

    doc.end();

    await new Promise((resolve:any) => writeStream.on("finish", resolve));
    logger.info(`PDF generated: ${filePath}`);
    return filePath;
  }

  // Gera Excel temporário e retorna o caminho do ficheiro
  async exportToExcel(reportId: string): Promise<string> {
    const report = await prisma.report.findUnique({ where: { id: reportId } });
    if (!report) throw new Error("Report not found");

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Report");

    sheet.columns = [
      { header: "Field", key: "field", width: 30 },
      { header: "Value", key: "value", width: 50 },
    ];

    sheet.addRow(["Title", report.title]);
    sheet.addRow(["Type", report.type]);
    sheet.addRow(["Generated At", report.createdAt.toISOString()]);

    sheet.addRow([]);
    sheet.addRow(["Report Data", ""]);

    const data = report.data as any;
    for (const key of Object.keys(data)) {
      sheet.addRow([key, String(data[key])]);
    }

    const filePath = path.join("/tmp", `report-${report.id}.xlsx`);
    await workbook.xlsx.writeFile(filePath);
    logger.info(`Excel generated: ${filePath}`);
    return filePath;
  }
}
