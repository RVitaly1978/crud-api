import { HttpStatusCode } from './enums'

export interface RequiredUser {
  username: string
  age: number
  hobbies: string[]
}

export interface User extends RequiredUser {
  id: string
}

export type HttpResponseError = {
  error: string
}

export type HttpResponseSuccess = {
  data: User | User[]
}

export interface HttpResponse {
  statusCode: HttpStatusCode
  response?: HttpResponseError | HttpResponseSuccess
}

export interface WorkerInnerData {
  action: string
  id?: string
  user?: RequiredUser | false
}
