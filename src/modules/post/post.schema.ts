import { Static, Type } from '@sinclair/typebox'
import { PaginationMetaSchema } from '../../common/pagination.schema'

export const PostSchema = Type.Object({
  id: Type.Number(),
  title: Type.String(),
  content: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
})
export type PostType = Static<typeof PostSchema>;

export const CreatePostBodySchema = Type.Object({
  title: Type.String({ minLength: 2 }),
  content: Type.String({ minLength: 2 })
})
export type CreatePostType = Static<typeof CreatePostBodySchema>;

export const PaginatedPostResponseSchema = Type.Object({
  data: Type.Array(PostSchema), 
  meta: PaginationMetaSchema
})
