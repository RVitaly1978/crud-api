import cluster from 'node:cluster'
import { IncomingMessage } from 'node:http'
import { HttpResponse, ErrorMessage, WorkerActions } from '../types'
import { UsersDB } from '../database/users'
import {
  getUserIdFromUrl,
  response200,
  response404,
  sendDataToPrimary,
} from '../helpers'

export const getUser = (req: IncomingMessage): HttpResponse | void => {
  const id = getUserIdFromUrl(req.url)

  if (cluster.isWorker) {
    sendDataToPrimary({ action: WorkerActions.GetUser, id })
    return
  }

  return processGetUser(id)
}

export const processGetUser = (id: string): HttpResponse => {
  const user = UsersDB.getUser(id)
  return user ? response200(user) : response404(ErrorMessage.UserNotExist)
}
