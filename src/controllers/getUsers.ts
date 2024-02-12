import cluster from 'node:cluster'
import { UsersDB } from '../database/users'
import { HttpResponse, WorkerActions } from '../types'
import { response200, sendDataToPrimary } from '../helpers'

export const getUsers = (): HttpResponse | void => {
  if (cluster.isWorker) {
    sendDataToPrimary({ action: WorkerActions.GetUsers })
    return
  }

  return processGetUsers()
}

export const processGetUsers = (): HttpResponse => {
  const users = UsersDB.getUsers()
  return response200(users)
}
