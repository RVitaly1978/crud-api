import { IncomingMessage } from 'node:http'

export const parseBody = async (
  req: IncomingMessage
): Promise<Record<string, unknown>> => {
  return new Promise((resolve) => {
    let body = ''
    req.setEncoding('utf8')
    req.on('data', (chunk: string) => (body += chunk))
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body) as Record<string, unknown>
        resolve(parsed)
      } catch {
        resolve({} as Record<string, unknown>)
      }
    })
  })
}
