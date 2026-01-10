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
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

const userRoutes: FastifyPluginAsync = async (fastify) => {
  const app = fastify.withTypeProvider<TypeBoxTypeProvider>();
  const repo = app.db.getRepository(User)
  const service = new UserService(new UserRepository(repo))
  const controller = new UserController(service)

  app.get(
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

  app.post(
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
