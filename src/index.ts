import { app } from './servers'
import { getPortFromEnv, logServerStartedOnPort } from './helpers'

const PORT = getPortFromEnv()

app().listen(PORT, () => {
  logServerStartedOnPort(PORT)
})
