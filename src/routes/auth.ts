import { FastifyInstance } from 'fastify';
import authRoutes from '../modules/auth/auth.routes';

export default async function (fastify: FastifyInstance) {
  fastify.register(authRoutes, { prefix: '/api/v1/auth' })
}
