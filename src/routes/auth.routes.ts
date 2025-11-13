import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../lib/middlewares/authenticate";

const controller = new AuthController();

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", controller.register);
  app.post("/login", controller.login);
  app.get("/me", { preHandler: [authenticate] }, controller.me);
}
