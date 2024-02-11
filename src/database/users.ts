import { randomUUID } from 'crypto'
import { User} from '../types'

export class Users {
  private users: User[] = []

  constructor () {}

  public getUsers () {
    return this.users
  }

  public getUser (id: string) {
    return this.users.find(user => user.id === id) || null
  }

  public createUser (user: User) {
    const item: User = { id: randomUUID(), ...user }
    this.users.push(item)
    return item
  }

  public updateUser (id: string, user: User) {
    const index = this.users.findIndex(user => user.id === id)
    if (index > -1) {
      const updated: User = { ...this.getUser(id), ...user }
      this.users.splice(index, 1, updated)
      return updated
    }
    return null
  }

  deleteUser (id: string) {
    const index = this.users.findIndex(user => user.id === id)
    if (index > -1) {
      this.users.splice(index, 1)
      return true
    }
    return false
  }
}

export const UsersDB = new Users()
