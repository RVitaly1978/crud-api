import { IncomingMessage } from 'node:http'
import { HttpResponse, ErrorMessage } from '../types'
import { UsersDB } from '../database/users'
import { response204, response404, getUserIdFromUrl } from '../helpers'

export const deleteUser = (req: IncomingMessage): HttpResponse => {
  const id = getUserIdFromUrl(req.url)

  const isSuccess = UsersDB.deleteUser(id)

  return isSuccess
    ? response204()
    : response404(ErrorMessage.UserNotExist)
}
