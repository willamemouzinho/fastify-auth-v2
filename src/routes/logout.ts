import { FastifyReply, FastifyRequest } from 'fastify'

export const logout = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    reply.clearCookie('refreshToken')
    return reply.code(204).send()
  } catch (err) {
    console.error(err)
    return reply.code(500).send({ message: 'Internal server error' })
  }
}
