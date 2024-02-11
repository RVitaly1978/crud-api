import { createServer, Server } from 'node:http'
import { router } from './router'
import { internalServerErrorResponse } from './helpers'

const headers = {
  'Content-Type': 'application/json',
}

export const app = (): Server => {
  const server = createServer(async (req, res) => {
    console.log(`Server started process ${process.pid}`)

    try {
      const { statusCode, response } = await router(req)
      res.writeHead(statusCode, headers)
      res.end(JSON.stringify(response))
    } catch {
      const { statusCode, response } = internalServerErrorResponse
      res.writeHead(statusCode, headers)
      res.end(JSON.stringify(response))
    }
  })

  return server
}
