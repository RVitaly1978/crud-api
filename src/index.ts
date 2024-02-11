import dotenv from 'dotenv'
import { app } from './server'
import { getPortFromEnv } from './helpers'

dotenv.config()

const PORT = getPortFromEnv()

app().listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
