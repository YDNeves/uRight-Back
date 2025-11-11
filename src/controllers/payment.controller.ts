import { FastifyRequest, FastifyReply } from "fastify";
import { PaymentService } from "../services/payment.service";

const paymentService = new PaymentService();

export class PaymentController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = request.body as any;
      const payment = await paymentService.createPayment(data);
      return reply.status(201).send(payment);
    } catch (error:any) {
      return reply.status(400).send({ error: error.message });
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const payments = await paymentService.getPayments();
    return reply.send(payments);
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const payment = await paymentService.getPaymentById(id);
      return reply.send(payment);
    } catch (error:any) {
      return reply.status(404).send({ error: error.message });
    }
  }

  async updateStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const { status } = request.body as { status: "PAID" | "FAILED" | "PENDING" };
      const updated = await paymentService.updateStatus(id, status);
      return reply.send(updated);
    } catch (error:any) {
      return reply.status(400).send({ error: error.message });
    }
  }

  async remove(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const result = await paymentService.deletePayment(id);
      return reply.send(result);
    } catch (error:any) {
      return reply.status(400).send({ error: error.message });
    }
  }
}
