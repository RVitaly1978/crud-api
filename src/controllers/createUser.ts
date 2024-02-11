import { IncomingMessage } from 'node:http'
import { HttpResponse, ErrorMessage } from '../types'
import { UsersDB } from '../database/users'
import { response201, response400, isValidBody, parseBody, getBodyWithAllowedFields } from '../helpers'

export const createUser = async (req: IncomingMessage): Promise<HttpResponse> => {
  const parsedBody = await parseBody(req)
  const body = getBodyWithAllowedFields(parsedBody)

  if (isValidBody(body)) {
    const user = UsersDB.createUser(body)
    return response201(user)
  }

  return response400(ErrorMessage.InvalidBody)
}
