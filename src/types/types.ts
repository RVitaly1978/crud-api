import { HttpStatusCode } from './enums'

export interface User {
  id?: string,
  username: string,
  age: number,
  hobbies: string[],
}

export type HttpResponseError = {
  error: string,
}

export type HttpResponseSuccess = {
  data: User | User[]
}

export interface HttpResponse {
  statusCode: HttpStatusCode,
  response?: HttpResponseError | HttpResponseSuccess
}
