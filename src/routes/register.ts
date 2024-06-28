import { FastifyReply, FastifyRequest } from 'fastify'
import bcrypt from 'bcrypt'

import { prisma } from '../libs/prisma'

export const register = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { name, username, password } = req.body as {
      name: string
      username: string
      password: string
    }

    const userExists = await prisma.user.findUnique({ where: { username } })
    if (userExists) {
      return reply.code(400).send({ message: 'Username already exists' })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, username, password: hash },
    })

    const accessToken = await reply.jwtSign({ id: user.id, name, username })
    const refreshToken = await reply.jwtSign(
      { username },
      {
        sign: { expiresIn: '30d' },
      }
    )

    reply.setCookie('refreshToken', refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return reply.code(201).send({ accessToken })
  } catch (err) {
    console.error(err)
    return reply.code(500).send({ message: 'Internal server error' })
  }
}
