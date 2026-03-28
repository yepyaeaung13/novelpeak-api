import { Static, Type } from '@sinclair/typebox'
import { PaginationMetaSchema } from '../../common/pagination.schema'
import { UserType } from './user.entity'

export const UserSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  createdAt: Type.String({ format: 'date-time' })
})

export const CreateUserBodySchema = Type.Object({
  name: Type.String({ minLength: 2 }),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
  userType: Type.Optional(Type.Enum(UserType))
})
export type CreateUserInput = Static<typeof CreateUserBodySchema>

export const PaginatedUserResponseSchema = Type.Object({
  data: Type.Array(UserSchema), 
  meta: PaginationMetaSchema
})
