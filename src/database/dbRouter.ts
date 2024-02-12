import { HttpResponse, WorkerInnerData, WorkerActions } from '../types'
import { methodNotAllowedResponse } from '../helpers'
import {
  processGetUsers,
  processGetUser,
  processCreateUser,
  processDeleteUser,
  processUpdateUser,
} from '../controllers'

export const dbRouter = (data: string): HttpResponse => {
  const { action, id, user } = JSON.parse(data) as WorkerInnerData

  switch (action) {
    case WorkerActions.GetUsers:
      return processGetUsers()
    case WorkerActions.GetUser:
      return processGetUser(id!)
    case WorkerActions.PostUser:
      return processCreateUser(user!)
    case WorkerActions.DeleteUser:
      return processDeleteUser(id!)
    case WorkerActions.PutUser:
      return processUpdateUser(id!, user!)
    default:
      return methodNotAllowedResponse
  }
}
