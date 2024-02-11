import { IncomingMessage } from 'node:http'
import { HttpResponse, ErrorMessage } from '../types'
import { UsersDB } from '../database/users'
import {
  response200, response400, response404,
  isValidBody, parseBody, extractAllowedFields, getUserIdFromUrl,
} from '../helpers'

export const updateUser = async (req: IncomingMessage): Promise<HttpResponse> => {
  const id = getUserIdFromUrl(req.url)

  const user = UsersDB.getUser(id)

  if (!user) {
    return response404(ErrorMessage.UserNotExist)
  }

  const parsedBody = await parseBody(req)
  const body = extractAllowedFields(parsedBody)

  if (isValidBody(body)) {
    const user = UsersDB.updateUser(id, body)
    return response200(user!)
  }

  return response400(ErrorMessage.InvalidBody)
}
