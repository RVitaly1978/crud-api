import cluster from 'node:cluster'
import { app } from './servers/singleServer'
import { createWorkers, createPrimaryServer } from './servers'
import { getPortFromEnv, logServerStartedOnPort } from './helpers'

const PORT = getPortFromEnv()

if (cluster.isPrimary) {
  const workersStartPort = PORT + 1

  createWorkers(workersStartPort)

  const primaryServer = createPrimaryServer(workersStartPort)

  primaryServer.listen(PORT, () => {
    logServerStartedOnPort(PORT)
  })
} else {
  app().listen(PORT, () => {
    logServerStartedOnPort(PORT)
  })
}
