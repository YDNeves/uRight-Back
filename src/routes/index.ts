import { FastifyInstance } from "fastify";
import { userRoutes } from "./user.routes";
import {authRoutes} from "./auth.routes";


export async function registerRoutes(app: FastifyInstance) {
  await userRoutes(app);
  await authRoutes(app);
}
