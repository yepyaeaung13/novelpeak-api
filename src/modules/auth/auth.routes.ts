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

const authRoutes: FastifyPluginAsync = async (fastify) => {
  const repo = fastify.db.getRepository(User)
  const authService = new AuthService(new AuthRepository(repo))

  // REGISTER
  fastify.post(
    '/register',
    {
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
  fastify.post(
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
  fastify.post(
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
