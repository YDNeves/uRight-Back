import { FastifyInstance } from "fastify";
import { MemberController } from "../controllers/member.controller";
import { authenticate } from "../lib/middlewares/authenticate";

const controller = new MemberController();

// Apenas ADMIN, SECRETARY ou TREASURER podem gerir membros
async function authorizeStaff(request: any, reply: any) {
  const user = request.user;
  const allowedRoles = ["ADMIN", "SECRETARY", "TREASURER"];
  if (!allowedRoles.includes(user?.role)) {
    return reply.status(403).send({ error: "Acesso negado. Permissão insuficiente." });
  }
}

export async function memberRoutes(app: FastifyInstance) {
  app.post("/members", { preHandler: [authenticate, authorizeStaff] }, controller.create);
  app.get("/members", { preHandler: [authenticate, authorizeStaff] }, controller.getAll);
  app.get("/members/:id", { preHandler: [authenticate] }, controller.getById);
  app.patch("/members/:id/status", { preHandler: [authenticate, authorizeStaff] }, controller.updateStatus);
  app.delete("/members/:id", { preHandler: [authenticate, authorizeStaff] }, controller.delete);
}
