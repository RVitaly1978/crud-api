import cluster from 'node:cluster'
import { availableParallelism } from 'node:os'
import { IncomingMessage } from 'node:http'
import { dbRouter } from '../database/dbRouter'
import { internalServerErrorResponse, parseMessageFromPrimary } from '../helpers'
import { router } from '../router'
import { HttpResponse } from '../types'

const numWorkers = availableParallelism() - 1

export const nextWorker = (currentWorker: number) => {
  return currentWorker === numWorkers - 1 ? 0 : currentWorker + 1
}

export const createWorker = (PORT: number) => {
  const worker = cluster.fork({ PORT })
  worker.on('message', (data: string) => {
    const response = dbRouter(data)
    worker.send(JSON.stringify(response))
  })
  worker.on('error', () => {
    worker.send(internalServerErrorResponse)
  })
  return worker
}

export const createWorkers = (startPort: number) => {
  Array(numWorkers).fill(null).map((_, i) => createWorker(startPort + i))
}

export const workerRouter = async (req: IncomingMessage): Promise<HttpResponse> => {
  const promise: Promise<HttpResponse> = new Promise((resolve) => {
    process.on('message', (data: string) => {
      const result = parseMessageFromPrimary(data)
      resolve(result)
    })
    process.on('error', () => {
      resolve(internalServerErrorResponse)
    })
  })
  const result = await router(req)
  return result
    ? new Promise((resolve) => resolve(result))
    : promise
}
