import { FastifyPluginAsync } from 'fastify'
import {
  RegisterBodySchema,
  LoginBodySchema,
  TokenResponseSchema,
  RegisterBodyType,
  LoginBodyType
} from './auth.schema'
import { User } from '../user/user.entity'
import { AuthRepository } from './auth.repository'
import { AuthService } from './auth.service'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

const authRoutes: FastifyPluginAsync = async (fastify) => {
  const app = fastify.withTypeProvider<TypeBoxTypeProvider>();
  const repo = app.db.getRepository(User)
  const authService = new AuthService(new AuthRepository(repo))

  // REGISTER
  app.post(
    '/register',
    {
      config: { rateLimit: { max: 5, timeWindow: "1 minute" }, },
      schema: {
        tags: ['Auth'],
        body: RegisterBodySchema,
        response: { 201: TokenResponseSchema }
      }
    },
    async (request, reply) => {
      const { email, password } = request.body as RegisterBodyType

      const user = await authService.register(email, password)

      const payload = { id: user.id, email: user.email }

      const accessToken = fastify.jwt.sign(payload, { expiresIn: '15m' })
      const refreshToken = fastify.jwt.sign(payload, { expiresIn: '7d' })

      await authService.storeRefreshToken(user.id, refreshToken)

      return reply.code(201).send({ accessToken, refreshToken })
    }
  )

  // LOGIN
  app.post(
    '/login',
    {
      schema: {
        tags: ['Auth'],
        body: LoginBodySchema,
        response: { 200: TokenResponseSchema }
      }
    },
    async (request, reply) => {
      const { email, password } = request.body as LoginBodyType

      const user = await authService.login(email, password)

      const payload = { id: user.id, email: user.email }

      const accessToken = fastify.jwt.sign(payload, { expiresIn: '15m' })
      const refreshToken = fastify.jwt.sign(payload, { expiresIn: '7d' })

      await authService.storeRefreshToken(user.id, refreshToken)

      return reply.send({ accessToken, refreshToken })
    }
  )

  // REFRESH
  app.post(
    '/refresh',
    {
      schema: {
        tags: ['Auth'],
        response: { 200: TokenResponseSchema }
      }
    },
    async (request, reply) => {
      const { id, email } = await request.jwtVerify() as { id: number; email: string }

      const refreshToken = request.headers.authorization?.replace('Bearer ', '')
      if (!refreshToken) {
        throw new Error('Missing refresh token')
      }

      const user = await authService.refresh(id, refreshToken)

      const payload = { id: user.id, email }

      const newAccessToken = fastify.jwt.sign(payload, { expiresIn: '15m' })
      const newRefreshToken = fastify.jwt.sign(payload, { expiresIn: '7d' })

      await authService.storeRefreshToken(user.id, newRefreshToken)

      return reply.send({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      })
    }
  )
}

export default authRoutes
