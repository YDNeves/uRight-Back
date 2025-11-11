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

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const data = request.body as { name?: string; province?: string };
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
