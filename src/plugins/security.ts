import fp from "fastify-plugin";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import cors from "@fastify/cors";
import { FastifyInstance } from "fastify";

interface SecurityPluginOptions {
  rateLimit?: {
    max: number;
    timeWindow: string;
  };
  cors?: {
    origins: string[];
  };
}

export default fp<SecurityPluginOptions>(
  async function securityPlugin(fastify: FastifyInstance, options) {

    // 🛡 Helmet
    await fastify.register(helmet, {
      global: true,
      contentSecurityPolicy: false,
    });

    // 🚦 Rate limit
    await fastify.register(rateLimit, {
      global: true,
      max: options.rateLimit?.max ?? 100,
      timeWindow: options.rateLimit?.timeWindow ?? "1 minute",
      allowList: (req) => req.url === "/health",
    });

    // 🌐 CORS (LOCKED)
    await fastify.register(cors, {
      origin: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    });
  },
  {
    name: "security-plugin",
  }
);
