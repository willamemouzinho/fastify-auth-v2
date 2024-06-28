import { FastifyReply, FastifyRequest } from 'fastify'

export const verifyAuth = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    // const refreshToken = req.cookies.refreshToken
    // if (!refreshToken) {
    //   return reply.code(400).send({ message: 'internal server error' })
    // }
    // console.log('\n', { refreshToken }, '\n')
    const cookies = req.cookies
    console.log('\n', { cookies }, '\n')

    try {
      await req.jwtVerify()
    } catch (err: any) {
      return reply.code(err.statusCode).send({ message: err.message })
    }
    return
  } catch (err) {
    console.error(err)
    return reply.code(500).send({ message: 'internal server error' })
  }
}
