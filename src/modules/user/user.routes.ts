import { FastifyPluginAsync } from 'fastify'
import {
  CreateUserBodySchema,
  UserSchema,
  PaginatedUserResponseSchema
} from './user.schema'
import { User } from './user.entity'
import { UserRepository } from './user.repository'
import { UserService } from './user.service'
import { UserController } from './user.controller'

const userRoutes: FastifyPluginAsync = async (fastify) => {
  const repo = fastify.db.getRepository(User)
  const service = new UserService(new UserRepository(repo))
  const controller = new UserController(service)

  fastify.get(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ['User'],
        response: {
          200: PaginatedUserResponseSchema
        }
      }
    },
    controller.getUsers
  )

  fastify.post(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ['User'],
        body: CreateUserBodySchema,
        response: {
          201: UserSchema
        }
      }
    },
    controller.createUser
  )
}

export default userRoutes
