import { FastifyReply, FastifyRequest } from 'fastify'
import { PostService } from './post.service'

type PostQuery = {
  page?: number
  limit?: number
}

export class PostController {
  constructor(private readonly service: PostService) {}

  getPosts = async (
    request: FastifyRequest<{ Querystring: PostQuery }>,
    reply: FastifyReply
  ) => {
    const page = request.query.page ?? 1
    const limit = request.query.limit ?? 10

    const result = await this.service.getPosts(page, limit)
    return reply.send(result)
  }

  createPost = async (
    request: FastifyRequest<{ Body: { name: string; email: string } }>,
    reply: FastifyReply
  ) => {
    const { name, email } = request.body
    const user = await this.service.createPost(name, email)
    return reply.code(201).send(user)
  }
}
