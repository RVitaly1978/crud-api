import cluster from 'node:cluster'
import { IncomingMessage } from 'node:http'
import { HttpResponse, ErrorMessage, WorkerActions } from '../types'
import { UsersDB } from '../database/users'
import {
  response204,
  response404,
  getUserIdFromUrl,
  sendDataToPrimary,
} from '../helpers'

export const deleteUser = (req: IncomingMessage): HttpResponse | void => {
  const id = getUserIdFromUrl(req.url)

  if (cluster.isWorker) {
    sendDataToPrimary({ action: WorkerActions.DeleteUser, id })
    return
  }

  return processDeleteUser(id)
}

export const processDeleteUser = (id: string): HttpResponse => {
  const isSuccess = UsersDB.deleteUser(id)
  return isSuccess ? response204() : response404(ErrorMessage.UserNotExist)
}
