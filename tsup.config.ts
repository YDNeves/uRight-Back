import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'], // ou seu ponto de entrada
  format: ['esm'],
  // Adicione esta linha para externar o Prisma
  external: ['@prisma/client'], 
});