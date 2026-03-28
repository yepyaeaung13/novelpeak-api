import { FastifyPluginAsync } from 'fastify'
import {
  CreateBookBodySchema,
  CreateOrUpdateChapterBodySchema,
} from './book.schema'
import { Book } from './entity/book.entity'
import { BookRepository, ChapterRepository } from './book.repository'
import { BookService } from './book.service'
import { BookController } from './book.controller'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Chapter } from './entity/chapter.entity'

const bookRoutes: FastifyPluginAsync = async (fastify) => {
  const app = fastify.withTypeProvider<TypeBoxTypeProvider>();

  const book = app.db.getRepository(Book);
  const chapter = app.db.getRepository(Chapter);

  const bookRepo = new BookRepository(book);
  const chapterRepo = new ChapterRepository(chapter);

  const service = new BookService(bookRepo, chapterRepo)
  const controller = new BookController(service)

  app.get(
    '/books',
    {
      preHandler: [fastify.adminAuthenticate],
      schema: {
        tags: ['Book'],
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
      }
    },
    controller.getChapterById
   )

  app.get("/books/trending", {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['Book'],
    }
  },
    controller.getTrendingBooks
  )

  app.get("/books/discover", {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['Book'],
    }
  },
    controller.getDiscoverBooks
  )

  app.get("/books/recommended", {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['Book'],
    }
  },
    controller.getRecommendedBooks
  )

  app.get("/books/my-books", {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['Book'],
    }
  },
    controller.getBooksByUserId
  )

  app.post(
    '/books',
    {
      preHandler: [fastify.adminAuthenticate],
      schema: {
        tags: ['Book'],
        body: CreateBookBodySchema,
      }
    },
    controller.createBook
  )

  app.post(
    '/books/:id/chapters',
    {
      preHandler: [fastify.adminAuthenticate],
      schema: {
        tags: ['Book'],
        body: CreateOrUpdateChapterBodySchema,
      }
    },
    controller.createChapter
  )

  app.put(
    '/books/chapters/:id',
    {
      preHandler: [fastify.adminAuthenticate],
      schema: {
        tags: ['Book'],
        body: CreateOrUpdateChapterBodySchema,
      }
    },
    controller.updateChapter
  )

   app.delete(
    '/books/chapters/:id',
    {
      preHandler: [fastify.adminAuthenticate],
      schema: {
        tags: ['Book'],
      }
    },
    controller.deleteChapter
  )
}

export default bookRoutes
