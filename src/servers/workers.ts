import cluster from 'node:cluster'
import { availableParallelism } from 'node:os'
import { dbRouter } from '../database/dbRouter'
import { internalServerErrorResponse, logWorkerServerDied } from '../helpers'

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
  Array(numWorkers)
    .fill(null)
    .map((_, i) => createWorker(startPort + i))

  cluster.on('exit', (worker) => {
    logWorkerServerDied(worker.id, worker.process.pid)
    createWorker(startPort + worker.id - 1)
  })
}
