import { IncomingMessage } from 'http'

export const parseBody = async (req: IncomingMessage) => {
  return new Promise((resolve) => {
    req.setEncoding('utf8')

    let rawBody = ''

    req.on('data', (chunk: string) => rawBody += chunk)

    req.on('end', () => {
      try {
        const body = JSON.parse(rawBody)
        resolve(body)
      } catch {
        resolve({})
      }
    })
  })
}
