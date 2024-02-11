import { UsersDB } from '../database/users'
import { HttpResponse } from '../types'
import { response200 } from '../helpers'

export const getUsers = (): HttpResponse => {
  const users = UsersDB.getUsers()
  return response200(users)
}
