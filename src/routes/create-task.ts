import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../libs/prisma'

export const createTask = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = req.user as {
      id: string
      name: string
      username: string
      iat: number
      exp: number
    }
    const { title, description } = req.body as {
      title: string
      description: string
    }

    const task = await prisma.tasks.create({
      data: { title, description, userId: user.id },
      select: {
        id: true,
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

    return reply.code(200).send({ task })
  } catch (err) {
    console.error(err)
    return reply.code(500).send({ message: 'Internal server error' })
  }
}
