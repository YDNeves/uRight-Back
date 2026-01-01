import { FastifyReply, FastifyRequest } from "fastify";
import { AssociationService } from "../services/association.service";

const service = new AssociationService();

export class AssociationController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      // O body agora existe porque o middleware extraiu do multipart
      const { name, province } = request.body as { name: string; province: string };
      const imageUrl = (request as any).imageUrl;
  
      if (!name || !province) {
        return reply.status(400).send({ error: "Nome e Província são obrigatórios" });
      }
  
      const association = await service.createAssociation({
        name,
        province,
        imageUrl,
      });
  
      reply.status(201).send(association);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async listAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const associations = await service.getAllAssociations();
      reply.send(associations);
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  }

  async getRandom(request: FastifyRequest, reply: FastifyReply) {
    const limit = Number((request.query as any).limit) || 10
  
    const associations = await service.getRandomAssociations(limit)
  
    return reply.send(associations)
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const association = await service.getAssociationById(id);
      reply.send(association);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }

  /**
   * Trata a atualização apenas do campo 'imageUrl'.
   * O body deve conter { imageUrl: string }.
   */
  async updateImage(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const imageUrl = (request as any).imageUrl; // já processada pelo middleware
  
      if (!imageUrl) {
        return reply.status(400).send({ error: "Nenhuma imagem enviada." });
      }
  
      const updated = await service.updateImageUrl(id, imageUrl);
      reply.send(updated);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      // Ajustado para incluir imageUrl como opcional no updateAssociation
      const data = request.body as { name?: string; province?: string; imageUrl?: string }; 
      const updated = await service.updateAssociation(id, data);
      reply.send(updated);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async remove(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const result = await service.deleteAssociation(id);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }
}