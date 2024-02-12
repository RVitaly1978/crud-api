import { HttpStatusCode, ErrorMessage, HttpResponse, User } from '../types'

export const methodNotAllowedResponse: HttpResponse = {
  statusCode: HttpStatusCode.MethodNotAllowed,
  response: { error: ErrorMessage.MethodNotAllowed },
}

export const internalServerErrorResponse: HttpResponse = {
  statusCode: HttpStatusCode.InternalServerError,
  response: { error: ErrorMessage.InternalServerError },
}

export const notFoundResourceResponse: HttpResponse = {
  statusCode: HttpStatusCode.NotFound,
  response: { error: ErrorMessage.ResourceNotExist },
}

export const badRequestResponse: HttpResponse = {
  statusCode: HttpStatusCode.BadRequest,
  response: { error: ErrorMessage.InvalidUserId },
}

export const response200 = (data: User | User[]): HttpResponse => ({
  statusCode: HttpStatusCode.Ok,
  response: { data },
})

export const response201 = (data: User): HttpResponse => ({
  statusCode: HttpStatusCode.Created,
  response: { data },
})

export const response204 = (): HttpResponse => ({
  statusCode: HttpStatusCode.NoContent,
})

export const response400 = (error: string): HttpResponse => ({
  statusCode: HttpStatusCode.BadRequest,
  response: { error },
})

export const response404 = (error: string): HttpResponse => ({
  statusCode: HttpStatusCode.NotFound,
  response: { error },
})
