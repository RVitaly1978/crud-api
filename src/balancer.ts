import { createServer, request } from 'node:http'
import cluster from 'node:cluster'
import { app, headers } from './server'
import { HttpMethod, HttpStatusCode } from './types'
import { createWorker, createWorkers, nextWorker } from './workers'
import {
  getPortFromEnv, parseBody, internalServerErrorResponse,
  logPrimaryServerProxyRequest, logServerStartedOnPort, logWorkerServerDied
} from './helpers'

const PORT = getPortFromEnv()

if (cluster.isPrimary) {
  const workersStartPort = PORT + 1
  let currentWorker = 0

  createWorkers(workersStartPort)

  cluster.on('exit', (worker) => {
    logWorkerServerDied(worker.id, worker.process.pid)
    createWorker(PORT + worker.id)
  })

  const primaryServer = createServer(async (req, res) => {
    currentWorker = nextWorker(currentWorker)

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

    if (req.method !== HttpMethod.Get && req.method !== HttpMethod.Delete) {
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
