import { FastifyReply, FastifyRequest } from 'fastify'
import bcrypt from 'bcrypt'

import { prisma } from '../libs/prisma'

export const login = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { username, password } = req.body as {
      username: string
      password: string
    }

    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) {
      return reply.code(400).send({ message: 'Invalid credentials' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (isValidPassword === false) {
      return reply.code(400).send({ message: 'Invalid credentials' })
    }

    const accessToken = await reply.jwtSign({
      id: user.id,
      name: user.name,
      username,
    })
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

    return reply.code(200).send({ accessToken })
  } catch (err) {
    console.error(err)
    return reply.code(500).send({ message: 'Internal server error' })
  }
}
