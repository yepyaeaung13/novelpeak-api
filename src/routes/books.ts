import { FastifyInstance } from 'fastify';
import bookRoutes from '../modules/book/book.routes';

export default async function (fastify: FastifyInstance) {
  fastify.register(bookRoutes, { prefix: '/api/v1' })
}
