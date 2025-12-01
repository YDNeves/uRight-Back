import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../lib/middlewares/authenticate";
// Necessário para processar e armazenar o arquivo binário
import { imageUploadMiddleware } from '../lib/middlewares/uploadimage'; 

const controller = new UserController();

// Middleware simples para verificar role de ADMIN
async function authorizeAdmin(request: any, reply: any) {
  const user = request.user; // preenchido por request.jwtVerify()
  if (user?.role !== "ADMIN") {
    return reply.status(403).send({ error: "Acesso negado. Apenas administradores podem executar esta ação." });
  }
}

export async function userRoutes(app: FastifyInstance) {
  
  // 📸 ROTA 1: UPLOAD E PROCESSAMENTO DE IMAGEM
  // Endpoint: /user/upload-image
  app.post(
    "/user/upload-image", 
    { preHandler: [authenticate, imageUploadMiddleware] as any },
    async (request, reply) => {
        // O middleware imageUploadMiddleware é responsável por responder ao cliente  com o { imageUrl: '...' } após o upload para o cloud. Aqui, você pode adicionar lógica adicional, se necessário.
        reply.send({ message: "Upload de imagem concluído com sucesso." });
    }
  );
  
  // ROTA 2: PERSISTÊNCIA DO URL NO BANCO DE DADOS Endpoint: /users/:id/image Recebe o imageUrl do frontend (que o obteve da ROTA 1) e salva no campo imageUrl do utilizador.
  app.patch(
    "/users/:id/image", 
    { preHandler: [authenticate] }, // Apenas autenticação é necessária para atualizar a própria imagem
    controller.updateImageUrl
  );

  // --- Rotas Existentes (Administrativas) ---
  
  // Todas as rotas de listagem/remoção exigem autenticação e autorização de ADMIN
  app.get("/users", { preHandler: [authenticate, authorizeAdmin] }, controller.getAll);
  app.get("/users/:id", { preHandler: [authenticate, authorizeAdmin] }, controller.getById);
  app.delete("/users/:id", { preHandler: [authenticate, authorizeAdmin] }, controller.delete);
}
