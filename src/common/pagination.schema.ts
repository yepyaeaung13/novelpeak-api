import { Type } from '@sinclair/typebox'

export const PaginationQuerySchema = Type.Object({
  page: Type.Optional(Type.Number({ minimum: 1, default: 1 })),
  limit: Type.Optional(
    Type.Number({ minimum: 1, maximum: 100, default: 10 })
  )
})

export const PaginationMetaSchema = Type.Object({
  page: Type.Number(),
  limit: Type.Number(),
  total: Type.Number(),
  totalPages: Type.Number()
})
