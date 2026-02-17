import fp from 'fastify-plugin'
import { DataSource } from 'typeorm'
import 'reflect-metadata'
import { User } from '../modules/user/user.entity'
import { Post } from '../modules/post/post.entity'
import { Book } from '../modules/book/entity/book.entity'
import { Chapter } from '../modules/book/entity/chapter.entity'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'yepyae',
  password: 'yepyae',
  database: 'novelfull',
  synchronize: true, // ❗ false in production
  logging: true,
  entities: [
    User,
    Post,
    Book,
    Chapter
  ]
})

export default fp(async (fastify) => {
  await AppDataSource.initialize()
  fastify.log.info('TypeORM connected')

  fastify.decorate('db', AppDataSource)
})
