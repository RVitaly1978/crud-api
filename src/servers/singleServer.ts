import cluster from 'node:cluster'
import { createServer, Server } from 'node:http'
import { router, workerRouter } from '../router'
import {
  internalServerErrorResponse,
  logServerProcessStarted,
} from '../helpers'

export const headers = {
  'Content-Type': 'application/json',
}

export const app = (): Server => {
  const server = createServer(async (req, res) => {
    logServerProcessStarted()

    try {
      if (cluster.isWorker) {
        const { statusCode, response } = await workerRouter(req)
        res.writeHead(statusCode, headers)
        res.end(JSON.stringify(response))
      } else {
        const { statusCode, response } = (await router(req))!
        res.writeHead(statusCode, headers)
        res.end(JSON.stringify(response))
      }
    } catch {
      const { statusCode, response } = internalServerErrorResponse
      res.writeHead(statusCode, headers)
      res.end(JSON.stringify(response))
    }
  })

  return server
}
