import { FastifyInstance } from 'fastify';
import commonRoutes from '../modules/common/route';

export default async function (fastify: FastifyInstance) {
  fastify.register(commonRoutes, { prefix: '/api/v1/common' })
}
