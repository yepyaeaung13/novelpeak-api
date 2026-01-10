import fp from 'fastify-plugin'
import { AppError } from '../common/error'
import { FastifyError } from 'fastify'

export default fp(async (fastify) => {
  fastify.setErrorHandler((error: FastifyError, request, reply) => {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({
        code: error.code,
        message: error.message
      })
      return
    }

    if (error.validation) {
      reply.status(400).send({
        code: 'VALIDATION_ERROR',
        message: 'Invalid request',
        errors: error.validation
      })
      return
    }

    request.log.error(error)

    reply.status(500).send({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong'
    })
  })
})
