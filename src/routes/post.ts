import { FastifyInstance } from 'fastify';
import postRoutes from '../modules/post/post.routes';

export default async function (fastify: FastifyInstance) {
  fastify.register(postRoutes, { prefix: '/api/v1/post' })
}
