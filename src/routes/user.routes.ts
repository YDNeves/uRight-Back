import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../lib/middlewares/authenticate";

const controller = new UserController();

// Middleware simples para verificar role de ADMIN
async function authorizeAdmin(request: any, reply: any) {
  const user = request.user; // preenchido por request.jwtVerify()
  if (user?.role !== "ADMIN") {
    return reply.status(403).send({ error: "Acesso negado. Apenas administradores podem executar esta ação." });
  }
}

export async function userRoutes(app: FastifyInstance) {
  // Todas as rotas exigem autenticação
  app.get("/users", { preHandler: [authenticate, authorizeAdmin] }, controller.getAll);
  app.get("/users/:id", { preHandler: [authenticate, authorizeAdmin] }, controller.getById);
  app.delete("/users/:id", { preHandler: [authenticate, authorizeAdmin] }, controller.delete);
}
