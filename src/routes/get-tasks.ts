import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../libs/prisma'

export const getTasks = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = req.user as {
      id: string
      name: string
      username: string
      iat: number
      exp: number
    }
    const tasks = await prisma.tasks.findMany({
      where: { userId: user.id },
      select: {
        title: true,
        description: true,
        createdAt: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    })

    return reply.code(200).send({ tasks })
  } catch (err) {
    console.error(err)
    return reply.code(500).send({ message: 'Internal server error' })
  }
}
