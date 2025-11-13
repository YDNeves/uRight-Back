import { FastifyInstance } from "fastify";
import { AssociationController } from "../controllers/association.controller";
import { authenticate } from "../lib/middlewares/authenticate";

const controller = new AssociationController();

export async function associationRoutes(app: FastifyInstance) {
  app.register(async (routes) => {
    routes.addHook("onRequest", authenticate);

    routes.post("/", controller.create);
    routes.get("/", controller.listAll);            
    routes.get("/:id", controller.getById);
    routes.put("/:id", controller.update);
    routes.delete("/:id", controller.remove);
  });
}
