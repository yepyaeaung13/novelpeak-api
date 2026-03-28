import { Type } from '@sinclair/typebox'
import { UserType } from '../user/user.entity'

export const RegisterBodySchema = Type.Object({
  name: Type.String({ minLength: 2 }),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
  userType: Type.Optional(Type.Enum(UserType)),
  adminSecret: Type.Optional(Type.String())
})

export const LoginBodySchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 })
})

export const TokenResponseSchema = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String()
})

export type RegisterBodyInput = typeof RegisterBodySchema.static
export type LoginBodyInput = typeof LoginBodySchema.static


