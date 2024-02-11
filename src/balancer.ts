import { createServer, request } from 'node:http'
import { availableParallelism } from 'node:os'
import cluster from 'node:cluster'
import dotenv from 'dotenv'
import { app, headers } from './server'
import { HttpMethod, HttpStatusCode } from './types'
import {
  getPortFromEnv, parseBody, internalServerErrorResponse,
  logPrimaryServerProxyRequest, logServerStartedOnPort, logWorkerServerDied
} from './helpers'

dotenv.config()

const PORT = getPortFromEnv()

const createWorker = (PORT: number) => {
  const worker = cluster.fork({ PORT })
  worker.on('message', (data: string) => {
    const workerData = JSON.parse(data)
    console.log(workerData)
  })
  return worker
}

if (cluster.isPrimary) {
  const numWorkers = availableParallelism() - 1
  const workersStartPort = PORT + 1
  let currentWorker = 0

  const workers = Array(numWorkers).fill(null).map((_, i) => createWorker(workersStartPort + i))

  cluster.on('exit', (worker, code, signal) => {
    logWorkerServerDied(worker.id, worker.process.pid)
    const reopened = createWorker(workersStartPort + worker.id)
    workers.splice(worker.id - 1, 1, reopened)
  })

  const primaryServer = createServer(async (req, res) => {
    currentWorker = currentWorker === numWorkers - 1 ? 0 : currentWorker + 1

    logPrimaryServerProxyRequest(req.method, workersStartPort + currentWorker, req.url)

    const options = {
      port: workersStartPort + currentWorker,
      path: req.url,
      method: req.method,
      headers,
    }

    const body = await parseBody(req)

    const proxyRequest = request(options, async (proxyResponse) => {
      try {
        res.statusCode = proxyResponse.statusCode!
        res.writeHead(res.statusCode, headers)

        if (res.statusCode === HttpStatusCode.NoContent) {
          res.end()
        }

        const response = await parseBody(proxyResponse)
        res.end(JSON.stringify(response))
      } catch {
        const { statusCode, response } = internalServerErrorResponse
        res.writeHead(statusCode, headers)
        res.end(JSON.stringify(response))
      }
    })

    if (req.method !== HttpMethod.Get) {
      proxyRequest.write(JSON.stringify(body))
    }

    proxyRequest.end()
  })

  primaryServer.listen(PORT, () => {
    logServerStartedOnPort(PORT)
  })
} else {
  app().listen(PORT, () => {
    logServerStartedOnPort(PORT)
  })
}
