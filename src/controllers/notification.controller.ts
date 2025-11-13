import { FastifyRequest, FastifyReply } from "fastify";
import { NotificationService } from "../services/notification.service";

const notificationService = new NotificationService();

export class NotificationController {
  async sendEmail(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { to, subject, message } = request.body as {
        to: string;
        subject: string;
        message: string;
      };
      const result = await notificationService.sendEmailNotification(to, subject, message);
      return reply.status(200).send(result);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }

  async sendSMS(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { phone, message } = request.body as { phone: string; message: string };
      const result = await notificationService.sendSMSNotification(phone, message);
      return reply.status(200).send(result);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }

  async sendWhatsApp(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { phone, message } = request.body as { phone: string; message: string };
      const result = await notificationService.sendWhatsAppNotification(phone, message);
      return reply.status(200).send(result);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }

  async list(request: FastifyRequest<{ Querystring: { recipient?: string } }>, reply: FastifyReply) {
    const { recipient } = request.query;
    const notifications = await notificationService.getNotifications(recipient);
    return reply.send(notifications);
  }
  

  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const notif = await notificationService.getNotificationById(id);
      return reply.send(notif);
    } catch (error: any) {
      return reply.status(404).send({ error: error.message });
    }
  }

  async markAsRead(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const notif = await notificationService.markAsRead(id);
      return reply.send(notif);
    } catch (error: any) {
      return reply.status(404).send({ error: error.message });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      await notificationService.deleteNotification(id);
      return reply.send({ message: "Notificação excluída com sucesso" });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  }
}
