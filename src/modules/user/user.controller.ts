import { FastifyReply, FastifyRequest } from 'fastify'
import { UserService } from './user.service'
import { CreateUserInput } from './user.schema'

type UserQuery = {
  page?: number
  limit?: number
}

export class UserController {
  constructor(private readonly service: UserService) {}

  getUsers = async (
    request: FastifyRequest<{ Querystring: UserQuery }>,
    reply: FastifyReply
  ) => {
    const page = request.query.page ?? 1
    const limit = request.query.limit ?? 10

    const result = await this.service.getUsers(page, limit)
    return reply.send(result)
  }

  createUser = async (
    request: FastifyRequest<{ Body: { name: string; email: string } }>,
    reply: FastifyReply
  ) => {
    const payload = request.body as CreateUserInput
    const user = await this.service.createUser(payload)
    return reply.code(201).send(user)
  }
}
