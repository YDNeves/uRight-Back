import { FastifyInstance } from "fastify";
import { NotificationController } from "../controllers/notification.controller";
import { authenticate } from "../lib/middlewares/authenticate";

const controller = new NotificationController();

export async function notificationRoutes(app: FastifyInstance) {
  app.register(async (notif) => {
    notif.addHook("onRequest", authenticate);

    // Envio de notificações
    notif.post("/email", controller.sendEmail.bind(controller));
    notif.post("/sms", controller.sendSMS.bind(controller));
    notif.post("/whatsapp", controller.sendWhatsApp.bind(controller));

    // Listagem e detalhe
    notif.get("/", controller.list.bind(controller));
    notif.get("/:id", controller.getById.bind(controller));

    // Marcar como lida e deletar
    notif.put("/:id/read", controller.markAsRead.bind(controller));
    notif.delete("/:id", controller.delete.bind(controller));
  });
}
