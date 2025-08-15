import { OpenAPIHono } from '@hono/zod-openapi'
import { Scalar } from '@scalar/hono-api-reference'
import { handle } from 'hono/vercel'

const app = new OpenAPIHono().basePath('/api')

app
  .doc('/doc', {
    openapi: '3.0.0',
    info: {
      title: 'Task App API',
      version: '1.0.0',
    },
  })
  .get('/scalar', Scalar({ url: '/api/doc' }))

//  Here's a sample
// const route = app.route('/tasks', taskApi)
// const route = app.route('/tasks')
export type AppType = typeof app

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
export const PATCH = handle(app)
