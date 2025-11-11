import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../lib/middlewares/authenticate";

const controller = new AuthController();

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register", controller.register);
  app.post("/auth/login", controller.login);
  app.get("/auth/me", { preHandler: [authenticate] }, controller.me);
}
