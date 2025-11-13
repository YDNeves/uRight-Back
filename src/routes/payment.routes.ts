import { FastifyInstance } from "fastify";
import { PaymentController } from "../controllers/payment.controller";
import { authenticate } from "../lib/middlewares/authenticate";

const controller = new PaymentController();

export async function paymentRoutes(app: FastifyInstance) {
  app.register(async (payment) => {
    payment.addHook("onRequest", authenticate);

    payment.post("/", controller.create.bind(controller));
    payment.get("/", controller.list.bind(controller));
    payment.get("/:id", controller.getById.bind(controller));
    payment.put("/:id/status", controller.updateStatus.bind(controller));
    payment.delete("/:id", controller.remove.bind(controller));
  });
}
