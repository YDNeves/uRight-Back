import { prisma } from "../lib/prisma";
import { logger } from "../config/logger";
import nodemailer from "nodemailer";
// futura integração: Twilio ou WhatsApp Business API

export class NotificationService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendEmailNotification(to: string, subject: string, message: string) {
    try {
      await this.transporter.sendMail({
        from: `"AssoGest" <${process.env.MAIL_FROM}>`,
        to,
        subject,
        html: message,
      });

      const log = await prisma.notification.create({
        data: {
          type: "EMAIL",
          recipient: to,
          subject,
          message,
          status: "SENT",
        },
      });

      logger.info(`📧 Email enviado para ${to}`);
      return log;
    } catch (error:any) {
      logger.error("Erro ao enviar e-mail:", error);
      await prisma.notification.create({
        data: {
          type: "EMAIL",
          recipient: to,
          subject,
          message,
          status: "FAILED",
        },
      });
      throw new Error("Falha ao enviar o e-mail.");
    }
  }

  async sendSMSNotification(phone: string, message: string) {
    try {
      // Aqui futuramente integras com um provedor como Twilio ou Termii
      logger.info(`📱 SMS simulado enviado para ${phone}`);

      return prisma.notification.create({
        data: {
          type: "SMS",
          recipient: phone,
          message,
          status: "SENT",
        },
      });
    } catch (error:any) {
      logger.error("Erro ao enviar SMS:", error);
      throw error;
    }
  }

  async sendWhatsAppNotification(phone: string, message: string) {
    try {
      // Placeholder: integração futura com WhatsApp Business API
      logger.info(`💬 WhatsApp simulado para ${phone}`);

      return prisma.notification.create({
        data: {
          type: "WHATSAPP",
          recipient: phone,
          message,
          status: "SENT",
        },
      });
    } catch (error:any) {
      logger.error("Erro ao enviar WhatsApp:", error);
      throw error;
    }
  }

  async getNotifications() {
    return prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getNotificationById(id: string) {
    const notif = await prisma.notification.findUnique({ where: { id } });
    if (!notif) throw new Error("Notificação não encontrada.");
    return notif;
  }
}
