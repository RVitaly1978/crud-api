import { IncomingMessage } from 'http'
import { HttpResponse, ErrorMessage } from '../types'
import { UsersDB } from '../database/users'
import { getUserIdFromUrl, response200, response404 } from '../helpers'

export const getUser = (req: IncomingMessage ): HttpResponse => {
  const id = getUserIdFromUrl(req.url)

  const user = UsersDB.getUser(id)

  return user
    ? response200(user)
    : response404(ErrorMessage.UserNotExist)
}
