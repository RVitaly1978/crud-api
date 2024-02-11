import dotenv from 'dotenv'
import { app } from './server'

dotenv.config()

const PORT = parseInt(process.env.PORT!, 10) || 4000

app().listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
