import dotenv from 'dotenv'
import { app } from './server'
import { getPortFromEnv, logServerStartedOnPort } from './helpers'

dotenv.config()

const PORT = getPortFromEnv()

app().listen(PORT, () => {
  logServerStartedOnPort(PORT)
})
