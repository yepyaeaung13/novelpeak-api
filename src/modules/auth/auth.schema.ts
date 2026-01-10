import { Type } from '@sinclair/typebox'

export const RegisterBodySchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 })
})

export const LoginBodySchema = RegisterBodySchema

export const TokenResponseSchema = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String()
})

export type RegisterBodyType = typeof RegisterBodySchema.static
export type LoginBodyType = typeof LoginBodySchema.static


