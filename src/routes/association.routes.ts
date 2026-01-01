import { FastifyInstance } from "fastify";
import { AssociationController } from "../controllers/association.controller";
import { authenticate } from "../lib/middlewares/authenticate";
import { processImage } from "../lib/middlewares/processImage.middleware";
const controller = new AssociationController();

export async function associationRoutes(app: FastifyInstance) {
  app.register(async (routes) => {
    // Aplica o middleware de autenticação a todas as rotas deste bloco
    routes.addHook("onRequest", authenticate);

    // --- 1. ROTA DE UPLOAD DE IMAGEM ---
    // O controller vai delegar para o service que usa processImageUpload
    routes.post("/upload-image", controller.updateImage);

    // --- 2. ROTA DE PERSISTÊNCIA DO URL (caso queira atualizar via body) ---
    // Mantido se houver necessidade de atualizar apenas a URL
    routes.patch("/:id/image", controller.updateImage);

    // --- Rotas CRUD existentes ---
    routes.get("/random", controller.getRandom);
    routes.post("/", { preHandler: processImage("associations") }, controller.create);
    routes.get("/", controller.listAll);
    routes.get("/:id", controller.getById);
    routes.put("/:id", controller.update);
    routes.delete("/:id", controller.remove);
  });
}
