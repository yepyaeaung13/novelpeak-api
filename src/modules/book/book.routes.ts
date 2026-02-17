import { FastifyPluginAsync } from 'fastify'
import {
  CreateBookBodySchema,
  BookSchema
} from './book.schema'
import { Book } from './entity/book.entity'
import { BookRepository, ChapterRepository } from './book.repository'
import { PostService } from './book.service'
import { BookController } from './book.controller'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Chapter } from './entity/chapter.entity'

const bookRoutes: FastifyPluginAsync = async (fastify) => {
  const app = fastify.withTypeProvider<TypeBoxTypeProvider>();

  const book = app.db.getRepository(Book);
  const chapter = app.db.getRepository(Chapter);

  const bookRepo = new BookRepository(book);
  const chapterRepo = new ChapterRepository(chapter);

  const service = new PostService(bookRepo, chapterRepo)
  const controller = new BookController(service)

  app.get(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ['Book'],
        // response: {
        //   200: PaginatedBookResponseSchema
        // }
      }
    },
    controller.getBooks
  )

  app.get(
    '/:id',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ['Book'],
        // response: {
        //   200: PaginatedBookResponseSchema
        // }
      }
    },
    controller.getBookById
  )

   app.get(
    '/chapters/:id',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ['Book'],
        // response: {
        //   200: PaginatedBookResponseSchema
        // }
      }
    },
    controller.getChapterById
  )

  app.get("/trending", {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['Book'],
      // response: {
      //   200: PaginatedBookResponseSchema
      // }
    }
  },
    controller.getTrendingBooks
  )

  app.get("/discover", {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['Book'],
      // response: {
      //   200: PaginatedBookResponseSchema
      // }
    }
  },
    controller.getDiscoverBooks
  )

  app.get("/recommended", {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['Book'],
      // response: {
      //   200: PaginatedBookResponseSchema
      // }
    }
  },
    controller.getRecommendedBooks
  )

  app.get("/my-books", {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['Book'],
      // response: {
      //   200: PaginatedBookResponseSchema
      // }
    }
  },
    controller.getBooksByUserId
  )

  app.post(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ['Post'],
        body: CreateBookBodySchema,
        response: {
          201: BookSchema
        }
      }
    },
    controller.createBook
  )
}

export default bookRoutes
