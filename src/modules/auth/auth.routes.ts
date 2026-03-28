import { FastifyPluginAsync } from 'fastify'
import {
  RegisterBodySchema,
  LoginBodySchema,
  RegisterBodyInput,
  LoginBodyInput
} from './auth.schema'
import { User, UserType } from '../user/user.entity'
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
      }
    },
    async (request, reply) => {
      const userData = request.body as RegisterBodyInput

      if (userData.userType && userData.userType !== UserType.READER) {
        if (!userData.adminSecret || userData.adminSecret !== process.env.ADMIN_SECRET) {
          throw new Error('Invalid admin secret')
        }
      }

      const user = await authService.register(userData)

      const payload = { id: user.id, email: user.email, userType: user.userType }

      const accessToken = fastify.jwt.sign(payload, { expiresIn: '7d' })
      const refreshToken = fastify.jwt.sign(payload, { expiresIn: '7d' })

      await authService.storeRefreshToken(user.id, refreshToken)

      return reply.code(201).send({ user: payload, accessToken, refreshToken })
    }
  )

  // LOGIN
  app.post(
    '/login',
    {
      schema: {
        tags: ['Auth'],
        body: LoginBodySchema,
      }
    },
    async (request, reply) => {
      const { email, password } = request.body as LoginBodyInput

      const user = await authService.login(email, password)

      if (user.userType !== UserType.READER) {
        throw new Error('Only readers can log in')
      }

      const payload = { id: user.id, email: user.email, userType: user.userType }

      const accessToken = fastify.jwt.sign(payload, { expiresIn: '15m' })
      const refreshToken = fastify.jwt.sign(payload, { expiresIn: '7d' })

      await authService.storeRefreshToken(user.id, refreshToken)

      return reply.send({ user: payload, accessToken, refreshToken })
    }
  )

  app.post(
    '/admin-login',
    {
      schema: {
        tags: ['Auth'],
        body: LoginBodySchema,
      }
    },
    async (request, reply) => {
      const { email, password } = request.body as LoginBodyInput

      const user = await authService.login(email, password)

      if (user.userType !== UserType.ADMIN) {
        throw new Error('Only admins can log in here')
      }

      const payload = { id: user.id, email: user.email, userType: user.userType }

      const accessToken = fastify.jwt.sign(payload, { expiresIn: '15m' })
      const refreshToken = fastify.jwt.sign(payload, { expiresIn: '7d' })

      await authService.storeRefreshToken(user.id, refreshToken)

      return reply.send({ user: payload, accessToken, refreshToken })
    }
  )

  // REFRESH
  app.post(
    '/refresh',
    {
      schema: {
        tags: ['Auth'],
      }
    },
    async (request, reply) => {
      const { id, email } = await request.jwtVerify() as { id: number; email: string }

      const refreshToken = request.headers.authorization?.replace('Bearer ', '')
      if (!refreshToken) {
        throw new Error('Missing refresh token')
      }

      const user = await authService.refresh(id, refreshToken)

      const payload = { id: user.id, email, userType: user.userType }

      const newAccessToken = fastify.jwt.sign(payload, { expiresIn: '15m' })
      const newRefreshToken = fastify.jwt.sign(payload, { expiresIn: '7d' })

      await authService.storeRefreshToken(user.id, newRefreshToken)

      return reply.send({
        user: payload,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      })
    }
  )
}

export default authRoutes
