import { prisma } from "../lib/prisma";
import { logger } from "../config/logger";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import  env  from "../config/env";

export class AuthService {
  async register(name: string, email: string, password: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("Email já registado.");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    logger.info(`Novo utilizador registado: ${user.email}`);

    const token = this.generateToken(user.id, user.role);
    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Credenciais inválidas.");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Credenciais inválidas.");

    const token = this.generateToken(user.id, user.role);
    logger.info(`Login bem-sucedido: ${user.email}`);

    return { user, token };
  }

  private generateToken(userId: string, role: string) {
    return jwt.sign({ userId, role }, env.JWT_SECRET, { expiresIn: "7d" });
  }
}
