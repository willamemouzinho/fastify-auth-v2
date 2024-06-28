import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'

import { verifyAuth } from './middlewares/auth-middleware'
import { register } from './routes/register'
import { login } from './routes/login'
import { logout } from './routes/logout'
import { getTasks } from './routes/get-tasks'
import { createTask } from './routes/create-task'
import { updateTask } from './routes/update-task'
import { deleteTask } from './routes/delete-task'

async function main() {
  const server = fastify({ logger: true })

  // configs
  server.register(fastifyCors)
  server.register(fastifyCookie, { hook: 'onRequest' })
  server.register(fastifyJwt, {
    secret: String(process.env.JWT_TOKEN_SECRET),
    sign: {
      expiresIn: '15m',
    },
  })

  // middlewares
  server.decorate('authenticate', verifyAuth)

  // routes - auth
  server.post('/api/auth/register', register)
  server.post('/api/auth/login', login)
  server.post('/api/auth/logout', { onRequest: [server.authenticate] }, logout)
  // routes - tasks
  server.post('/api/tasks', { onRequest: [server.authenticate] }, createTask)
  server.get('/api/tasks', { onRequest: [server.authenticate] }, getTasks)
  server.patch(
    '/api/tasks/:taskId',
    { onRequest: [server.authenticate] },
    updateTask
  )
  server.delete(
    '/api/tasks/:taskId',
    { onRequest: [server.authenticate] },
    deleteTask
  )

  // start server
  try {
    await server.listen({ port: 3333 })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

main()
