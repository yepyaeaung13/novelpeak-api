import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'
import { FastifyReply, FastifyRequest } from 'fastify'
import { UserType } from '../modules/user/user.entity'

export default fp(async (fastify) => {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'super-secret-key'
  })

  fastify.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify()
      } catch (err) {
        reply.status(401).send(err)
      }
    }
  )

  fastify.decorate(
    'adminAuthenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify()
        if ((request.user as any).userType !== UserType.ADMIN) {
          throw new Error('Admin access required')
        }
      } catch (err) {
        reply.status(401).send(err)
      }
    }
  )
})
