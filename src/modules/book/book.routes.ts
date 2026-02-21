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
    '/books',
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
    '/books/:id',
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
    '/books/chapters/:id',
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

  app.get("/books/trending", {
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

  app.get("/books/discover", {
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

  app.get("/books/recommended", {
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

  app.get("/books/my-books", {
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
    '/books',
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

   app.post(
    '/books/seed-data',
    {
      // preHandler: [fastify.authenticate],
      schema: {
        tags: ['Post'],
        // body: CreateBookBodySchema,
        // response: {
        //   201: BookSchema
        // }
      }
    },
    controller.seedBooks
  )
}

export default bookRoutes
