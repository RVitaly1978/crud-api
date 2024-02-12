import { IncomingMessage } from 'node:http'
import { HttpResponse, HttpMethod } from '../types'
import { getUsers, createUser, getUser, updateUser, deleteUser } from '../controllers'
import {
  notFoundResourceResponse, badRequestResponse, methodNotAllowedResponse,
  matchBaseUrl, matchValidUserIdUrl, matchInvalidUserIdUrl, logServerRouterProcessRequest,
} from '../helpers'

export const router = async (req: IncomingMessage): Promise<HttpResponse | void> => {
  const { method, url } = req

  logServerRouterProcessRequest(method, url)

  if (matchBaseUrl(url)) {
    switch (method) {
      case HttpMethod.Get: return getUsers()
      case HttpMethod.Post: return (await createUser(req))
      default: return methodNotAllowedResponse
    }
  }

  if (matchValidUserIdUrl(url)) {
    switch (method) {
      case HttpMethod.Get: return getUser(req)
      case HttpMethod.Put: return (await updateUser(req))
      case HttpMethod.Delete: return deleteUser(req)
      default: return methodNotAllowedResponse
    }
  }

  if (matchInvalidUserIdUrl(url)) {
    return badRequestResponse
  }

  return notFoundResourceResponse
}
