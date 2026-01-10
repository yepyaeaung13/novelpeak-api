import { FastifyInstance } from 'fastify'
import userRoutes from '../modules/user/user.routes'

export default async function (fastify: FastifyInstance) {
  fastify.register(userRoutes, { prefix: '/users' })
}
