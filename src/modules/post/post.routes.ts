import { FastifyPluginAsync } from 'fastify'
import {
  CreatePostBodySchema,
  PostSchema,
  PaginatedPostResponseSchema
} from './post.schema'
import { Post } from './post.entity'
import { PostRepository } from './post.repository'
import { PostService } from './post.service'
import { PostController } from './post.controller'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

const postRoutes: FastifyPluginAsync = async (fastify) => {
  const app = fastify.withTypeProvider<TypeBoxTypeProvider>();
  const repo = app.db.getRepository(Post)
  const service = new PostService(new PostRepository(repo))
  const controller = new PostController(service)

  app.get(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ['Post'],
        response: {
          200: PaginatedPostResponseSchema
        }
      }
    },
    controller.getPosts
  )

  app.post(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ['Post'],
        body: CreatePostBodySchema,
        response: {
          201: PostSchema
        }
      }
    },
    controller.createPost
  )
}

export default postRoutes
