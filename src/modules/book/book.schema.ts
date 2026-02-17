import { Static, Type } from '@sinclair/typebox'
import { PaginationMetaSchema } from '../../common/pagination.schema'

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
  content: Type.String({ minLength: 2 })
})
export type CreateBookType = Static<typeof CreateBookBodySchema>;

export const PaginatedBookResponseSchema = Type.Object({
  data: Type.Array(BookSchema), 
  meta: PaginationMetaSchema
})
