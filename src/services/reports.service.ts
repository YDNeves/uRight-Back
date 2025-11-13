import { prisma } from "../lib/prisma";
import { logger } from "../config/logger";
import { ReportType } from "@prisma/client";

export class ReportsService {
  async generateGeneralReport(userId: string) {
    const totalMembers = await prisma.member.count();
    const activeMembers = await prisma.member.count({ where: { status: "ACTIVE" } });
    const totalPayments = await prisma.payment.count();
    const totalPaid = (await prisma.payment.aggregate({ _sum: { amount: true } }))._sum.amount || 0;
    const totalAssociations = await prisma.association.count();

    const data = {
      totalMembers,
      activeMembers,
      totalAssociations,
      totalPayments,
      totalPaid,
      generatedAt: new Date(),
    };

    const report = await prisma.report.create({
      data: {
        title: "General Report",
        type: ReportType.GENERAL,
        generatedById: userId,
        data,
      },
    });

    logger.info("General report generated successfully");
    return report;
  }

  async generateAssociationReport(associationId: string, userId: string) {
    const association = await prisma.association.findUnique({
      where: { id: associationId },
      include: { members: true, payments: true },
    });

    if (!association) throw new Error("Association not found");

    const totalMembers = association.members.length;
    const totalPaid = association.payments
      .filter(p => p.status === "PAID")
      .reduce((acc, p) => acc + p.amount, 0);

    const data = {
      associationName: association.name,
      province: association.province,
      totalMembers,
      totalPaid,
      generatedAt: new Date(),
    };

    const report = await prisma.report.create({
      data: {
        title: `Association Report - ${association.name}`,
        type: ReportType.ASSOCIATION,
        generatedById: userId,
        associationId,
        data,
      },
    });

    logger.info(`Association report generated for ${association.name}`);
    return report;
  }

  async listReports() {
    return prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      include: { generatedBy: true, association: true },
    });
  }

  async getReportById(id: string) {
    const report = await prisma.report.findUnique({
      where: { id },
      include: { generatedBy: true, association: true },
    });

    if (!report) throw new Error("Report not found");
    return report;
  }

  async deleteReport(id: string) {
    return prisma.report.delete({ where: { id } });
  }
}
