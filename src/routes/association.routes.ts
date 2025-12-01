import { FastifyInstance } from "fastify";
import { AssociationController } from "../controllers/association.controller";
import { authenticate } from "../lib/middlewares/authenticate";
// Importação necessária para lidar com o arquivo binário
import { imageUploadMiddleware } from '../lib/middlewares/uploadimage';
import { FastifyRequest, FastifyReply } from "fastify";

const controller = new AssociationController();

export async function associationRoutes(app: FastifyInstance) {
  app.register(async (routes) => {
    // Aplica o middleware de autenticação a todas as rotas neste bloco
    routes.addHook("onRequest", authenticate);

    // 1. ROTA DE UPLOAD DE IMAGEM (Recebe o arquivo, processa e retorna o URL)
    // O middleware de imagem fará o trabalho e enviará a resposta HTTP 200 com o { imageUrl: '...' }
    routes.post(
      "/upload-image", // Endpoint: /api/association/upload-image
      {
      preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
        await new Promise<void>((resolve, reject) => {
        imageUploadMiddleware(request as any, reply as any, (err?: any) => {
          if (err) {
          reject(err);
          } else {
          resolve();
          }
        });
        });
      },
      },
      async (request, reply) => {
      // O middleware já respondeu, este handler é opcional/vazio.
      reply.send({ message: "Upload concluído com sucesso!" });
      }
    );

    // 2. ROTA DE PERSISTÊNCIA DO URL (Recebe o URL e salva no DB)
    routes.patch(
      "/:id/image", // Endpoint: /api/association/:id/image
      controller.updateImageUrl
    );

    // --- Rotas Existentes ---
    routes.post("/", controller.create);
    routes.get("/", controller.listAll);          
    routes.get("/:id", controller.getById);
    routes.put("/:id", controller.update);
    routes.delete("/:id", controller.remove);
  });
}