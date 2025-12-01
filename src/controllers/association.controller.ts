import { FastifyReply, FastifyRequest } from "fastify";
import { AssociationService } from "../services/association.service";

const service = new AssociationService();

export class AssociationController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { name, province } = request.body as { name: string; province: string };
      const association = await service.createAssociation({ name, province });
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
  async updateImageUrl(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      // Espera que o body contenha o URL da imagem (resultado do middleware)
      const { imageUrl } = request.body as { imageUrl: string }; 

      if (!imageUrl) {
        return reply.status(400).send({ error: "O campo 'imageUrl' é obrigatório." });
      }

      const updatedAssociation = await service.updateImageUrl(id, imageUrl);
      reply.send(updatedAssociation);
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