import cluster from 'node:cluster'
import { IncomingMessage } from 'node:http'
import { HttpResponse, ErrorMessage, WorkerActions, RequiredUser } from '../types'
import { UsersDB } from '../database/users'
import {
  response200, response400, response404, sendDataToPrimary,
  parseBody, extractValidUserOrFalse, getUserIdFromUrl,
} from '../helpers'

export const updateUser = async (req: IncomingMessage): Promise<HttpResponse | void> => {
  const id = getUserIdFromUrl(req.url)
  const parsedBody = await parseBody(req)
  const userOrFalse = extractValidUserOrFalse(parsedBody)

  if (cluster.isWorker) {
    sendDataToPrimary({ action: WorkerActions.PutUser, id, user: userOrFalse })
    return
  }

  return processUpdateUser(id, userOrFalse)
}

export const processUpdateUser = (id: string, body: RequiredUser | false): HttpResponse => {
  const user = UsersDB.getUser(id)
  if (user && body) {
    const user = UsersDB.updateUser(id, body)
    return response200(user!)
  }
  return !user
    ? response404(ErrorMessage.UserNotExist)
    : response400(ErrorMessage.InvalidBody)
}
