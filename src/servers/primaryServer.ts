import { createServer, request } from 'node:http'
import { headers } from '../servers/singleServer'
import { HttpMethod, HttpStatusCode } from '../types'
import { nextWorker } from '../servers'
import {
  parseBody,
  internalServerErrorResponse,
  logPrimaryServerProxyRequest,
} from '../helpers'

export const createPrimaryServer = (workersStartPort: number) => {
  let currentWorker = 0

  const primaryServer = createServer(async (req, res) => {
    currentWorker = nextWorker(currentWorker)

    logPrimaryServerProxyRequest(
      req.method,
      workersStartPort + currentWorker,
      req.url
    )

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

  return primaryServer
}
