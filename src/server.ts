import cluster from 'node:cluster'
import { createServer, Server, IncomingMessage } from 'node:http'
import { router } from './router'
import { internalServerErrorResponse, logServerProcessStarted, parseMessageFromPrimary } from './helpers'
import { HttpResponse } from './types'

export const headers = {
  'Content-Type': 'application/json',
}

const workerRouter = async (req: IncomingMessage): Promise<HttpResponse> => {
  const promise: Promise<HttpResponse> = new Promise((resolve) => {
    process.on('message', (data: string) => {
      const result = parseMessageFromPrimary(data)
      resolve(result)
    })
  })
  const result = await router(req)
  return result
    ? new Promise((resolve) => resolve(result))
    : promise
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
