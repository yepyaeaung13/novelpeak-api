import { Static, Type } from '@sinclair/typebox'
import { PaginationMetaSchema } from '../../common/pagination.schema'
// import { BookStatus } from './entity/book.entity';

export const BookSchema = Type.Object({
  id: Type.Number(),
  title: Type.String(),
  content: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
})
export type BookType = Static<typeof BookSchema>;

export const CreateBookBodySchema = Type.Object({
  title: Type.String({ minLength: 2 }),
  author: Type.String({ minLength: 2 }),
  description: Type.String({ minLength: 2 }),
  coverImage: Type.String({ format: 'uri', nullable: true }),
  // categories: Type.Array(Type.String({ minLength: 2 })),
  // status: Type.Enum(BookStatus)
})
export type CreateBookInput = Static<typeof CreateBookBodySchema>;

export const PaginatedBookResponseSchema = Type.Object({
  data: Type.Array(BookSchema),
  meta: PaginationMetaSchema
})
