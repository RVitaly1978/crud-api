import cluster from 'node:cluster'
import { IncomingMessage } from 'node:http'
import {
  HttpResponse,
  ErrorMessage,
  WorkerActions,
  RequiredUser,
} from '../types'
import { UsersDB } from '../database/users'
import {
  response201,
  response400,
  parseBody,
  extractValidUserOrFalse,
  sendDataToPrimary,
} from '../helpers'

export const createUser = async (
  req: IncomingMessage
): Promise<HttpResponse | void> => {
  const parsedBody = await parseBody(req)
  const userOrFalse = extractValidUserOrFalse(parsedBody)

  if (cluster.isWorker) {
    sendDataToPrimary({ action: WorkerActions.PostUser, user: userOrFalse })
    return
  }

  return processCreateUser(userOrFalse)
}

export const processCreateUser = (body: RequiredUser | false): HttpResponse => {
  if (body) {
    const user = UsersDB.createUser(body)
    return response201(user)
  }
  return response400(ErrorMessage.InvalidBody)
}
