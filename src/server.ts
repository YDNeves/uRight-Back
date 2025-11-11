import 'dotenv/config';
import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import jwtPlugin from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import helmet from '@fastify/helmet';
import env from './config/env.js';
import { logger } from './config/logger';
import { prisma } from './lib/prisma';
import { registerRoutes } from './routes/index';

// Inicializa o Fastify com o logger e a opção de proxy para produção
const app = Fastify({
  logger:true,
  trustProxy: env.NODE_ENV === 'production'
});

// --- Plugins ---
await app.register(cors, { origin: env.CORS_ORIGIN });
await app.register(helmet);
await app.register(rateLimit, { max: 100, timeWindow: '1 minute' });
await app.register(jwtPlugin, { secret: env.JWT_SECRET });

// --- Decorator de Autenticação com Tipagem ---
app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Token de autenticação inválido ou ausente.' });
  }
});

// --- Rotas e Hooks ---
app.get('/health', async () => ({ status: 'ok' }));

await registerRoutes(app);

app.addHook('onClose', async () => {
  await prisma.$disconnect();
});

export default app;