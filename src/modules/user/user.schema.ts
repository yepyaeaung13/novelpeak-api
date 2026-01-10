import { Type } from '@sinclair/typebox'
import { PaginationMetaSchema } from '../../common/pagination.schema'

export const UserSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  createdAt: Type.String({ format: 'date-time' })
})

export const CreateUserBodySchema = Type.Object({
  name: Type.String({ minLength: 2 }),
  email: Type.String({ format: 'email' })
})

export const PaginatedUserResponseSchema = Type.Object({
  data: Type.Array(UserSchema), 
  meta: PaginationMetaSchema
})
