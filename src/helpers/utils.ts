import dotenv from 'dotenv'
import { WorkerInnerData, HttpResponse } from '../types'

export const getPortFromEnv = () => {
  dotenv.config()
  return parseInt(process.env.PORT!, 10) || 4000
}

export const sendDataToPrimary = (data: WorkerInnerData) => {
  process.send?.(JSON.stringify(data))
}

export const parseMessageFromPrimary = (data: string): HttpResponse => {
  return JSON.parse(data) as HttpResponse
}
