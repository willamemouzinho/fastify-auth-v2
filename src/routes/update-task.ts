import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../libs/prisma'

export const updateTask = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = req.user as {
      id: string
      name: string
      username: string
      iat: number
      exp: number
    }
    const { taskId } = req.params as {
      taskId: string
    }
    const { title, description } = req.body as {
      title: string
      description: string
    }

    const task = await prisma.tasks.findUnique({
      where: { id: taskId },
    })
    if (!task) {
      return reply.code(400).send({ message: 'Task not found' })
    }

    await prisma.tasks.update({
      data: {
        title,
        description,
      },
      where: { id: taskId },
    })

    return reply.code(204).send()
  } catch (err) {
    console.error(err)
    return reply.code(500).send({ message: 'Internal server error' })
  }
}
