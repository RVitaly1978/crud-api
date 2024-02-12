import { IncomingMessage } from 'node:http'
import {
  internalServerErrorResponse,
  parseMessageFromPrimary,
} from '../helpers'
import { router } from './router'
import { HttpResponse } from '../types'

export const workerRouter = async (
  req: IncomingMessage
): Promise<HttpResponse> => {
  const promise: Promise<HttpResponse> = new Promise((resolve) => {
    process.on('message', (data: string) => {
      const result = parseMessageFromPrimary(data)
      resolve(result)
    })
    process.on('error', () => {
      resolve(internalServerErrorResponse)
    })
  })

  const result = await router(req)

  return result ? new Promise((resolve) => resolve(result)) : promise
}
