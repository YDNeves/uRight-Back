import { FastifyInstance } from "fastify"
import { authenticate } from "../lib/middlewares/authenticate"

// Importação das rotas
import { authRoutes } from "./auth.routes"
import { userRoutes } from "./user.routes"
import { associationRoutes } from "./association.routes"
import { memberRoutes } from "./member.routes"
import { paymentRoutes } from "./payment.routes"
import { reportsRoutes } from "./reports.routes"
import { financeRoutes } from "./finance.routes"
import { notificationRoutes } from "./notification.routes"

export async function registerRoutes(app: FastifyInstance) {
  // Rotas públicas
  app.register(authRoutes, { prefix: "/auth" })

  // Rotas protegidas
  app.register(async (privateRoutes) => {
    privateRoutes.addHook("onRequest", authenticate)

    privateRoutes.register(userRoutes)
    privateRoutes.register(associationRoutes, { prefix: "/associations" })
    privateRoutes.register(memberRoutes)
    privateRoutes.register(paymentRoutes, { prefix: "/payments" })
    privateRoutes.register(reportsRoutes, { prefix: "/reports" })
    privateRoutes.register(financeRoutes, { prefix: "/finance" })
    privateRoutes.register(notificationRoutes, { prefix: "/notifications" })
  })
}
