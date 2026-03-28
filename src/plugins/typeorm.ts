import fp from 'fastify-plugin'
import { DataSource } from 'typeorm'
import 'reflect-metadata'
import { User } from '../modules/user/user.entity'
import { Post } from '../modules/post/post.entity'
import { Book } from '../modules/book/entity/book.entity'
import { Chapter } from '../modules/book/entity/chapter.entity'
import { Category } from '../modules/book/entity/category.entity'
import { ReadingProgress } from '../modules/book/entity/reading.entity'
import { Favorite } from '../modules/book/entity/favorite,entity'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.db_host,
  port: Number(process.env.db_port),
  username: process.env.db_user,
  password: process.env.db_pass,
  database: process.env.db_name,
  synchronize: true, // ❗ false in production
  logging: true,
  entities: [
    User,
    Post,
    Book,
    Chapter,
    Category,
    ReadingProgress,
    Favorite
  ]
})

export default fp(async (fastify) => {
  await AppDataSource.initialize()
  fastify.log.info('TypeORM connected')

  fastify.decorate('db', AppDataSource)
})
