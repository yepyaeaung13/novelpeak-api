import fp from 'fastify-plugin'
import { DataSource } from 'typeorm'
import 'reflect-metadata'
import { User } from '../modules/user/user.entity'
import { Post } from '../modules/post/post.entity'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'yepyae',
  password: 'yepyae',
  database: 'dilocode_db',
  synchronize: true, // ❗ false in production
  logging: true,
  entities: [
    User,
    Post
  ]
})

export default fp(async (fastify) => {
  await AppDataSource.initialize()
  fastify.log.info('TypeORM connected')

  fastify.decorate('db', AppDataSource)
})
