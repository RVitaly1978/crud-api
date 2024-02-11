import supertest from 'supertest'
import dotenv from 'dotenv'
import { app as server } from '../server'
import { UsersDB } from '../database/users'
import { getPortFromEnv, matchUuid, baseUrl } from '../helpers'
import {
  User, RequiredUser,
  HttpStatusCode, HttpResponseError, HttpResponseSuccess, ErrorMessage,
} from '../types'

dotenv.config()
const PORT = getPortFromEnv()

const user: RequiredUser = { username: 'Vitaly', age: 45, hobbies: ['coding'] }
const updatedUser: RequiredUser = { ...user, username: 'Vitaly R' }

const app = server().listen(PORT - 1, () => {
  console.log(`Testing server started on port ${PORT - 1}`)
})

const request = supertest(app)

let response: { body: HttpResponseError | HttpResponseSuccess, statusCode: HttpStatusCode }
let userId: string
let userId1: string
let userId2: string

describe('CRUD service API tests', () => {
  afterAll(() => {
    app.close()
  })

  describe('Create, update and delete new user', () => {
    afterAll(() => {
      UsersDB.deleteUsers()
    })

    test('GET:/api/users. Should get empty list of users', async () => {
      response = await request.get(baseUrl)
      expect(response.statusCode).toBe(HttpStatusCode.Ok)
      expect(response.body).toMatchObject({ data: [] })
    })

    test('POST:/api/users. Should create a new user', async () => {
      response = await request.post(baseUrl).send(user)
      expect(response.statusCode).toBe(HttpStatusCode.Created)
      expect(response.body).toMatchObject({ data: user })
      userId = ((response.body as HttpResponseSuccess).data as User).id
      expect(matchUuid(userId)).toBeTruthy()
    })

    test('GET:/api/users/{userId}. Should get created user', async () => {
      response = await request.get(`${baseUrl}/${userId}`)
      expect(response.statusCode).toBe(HttpStatusCode.Ok)
      expect(response.body).toMatchObject({ data: { ...user, id: userId } })
    })

    test('PUT:/api/users/{userId}. Should update and return user', async () => {
      response = await request.put(`${baseUrl}/${userId}`).send(updatedUser)
      expect(response.statusCode).toBe(HttpStatusCode.Ok)
      expect(response.body).toMatchObject({ data: { ...updatedUser, id: userId } })
    })

    test('DELETE:/api/users/{userId}. Should delete user and return statusCode 204', async () => {
      response = await request.delete(`${baseUrl}/${userId}`)
      expect(response.statusCode).toBe(HttpStatusCode.NoContent)
    })

    test('GET:/api/users/{userId}. Should return statusCode 404 and error message', async () => {
      response = await request.get(`${baseUrl}/${userId}`)
      expect(response.statusCode).toBe(HttpStatusCode.NotFound)
      expect(response.body).toMatchObject({ error: ErrorMessage.UserNotExist })
    })
  })

  describe('Try to get non-existed resources and sent invalid user', () => {
    test('PUT:/api/users. Should return statusCode 405 and MethodNotAllowed error message', async () => {
      response = await request.put('/api/users').send(user)
      expect(response.statusCode).toBe(HttpStatusCode.MethodNotAllowed)
      expect(response.body).toMatchObject({ error: ErrorMessage.MethodNotAllowed })
    })

    test('GET:/api/private/users. Should return statusCode 404 and ResourceNotExist error message', async () => {
      response = await request.get('/api/private/users')
      expect(response.statusCode).toBe(HttpStatusCode.NotFound)
      expect(response.body).toMatchObject({ error: ErrorMessage.ResourceNotExist })
    })

    test('GET:/api/users/{invalidId}. Should return statusCode 400 and InvalidUserId error message', async () => {
      response = await request.get(`${baseUrl}/invalid-user-id`)
      expect(response.statusCode).toBe(HttpStatusCode.BadRequest)
      expect(response.body).toMatchObject({ error: ErrorMessage.InvalidUserId })
    })

    test('GET:/api/users/{non-existedId}. Should return statusCode 404 and UserNotExist error message', async () => {
      response = await request.get(`${baseUrl}/9d3d40dd-1464-4aa6-8a4c-a69e72086c5f`)
      expect(response.statusCode).toBe(HttpStatusCode.NotFound)
      expect(response.body).toMatchObject({ error: ErrorMessage.UserNotExist })
    })

    test('POST:/api/users. Should return statusCode 400 and InvalidBody error message', async () => {
      const invalidUser = { ...user, hobbies: [true, 999] }
      response = await request.post('/api/users').send(invalidUser)
      expect(response.statusCode).toBe(HttpStatusCode.BadRequest)
      expect(response.body).toMatchObject({ error: ErrorMessage.InvalidBody })
    })
  })

  describe('Create two users, get them, update one, delete another', () => {
    afterAll(() => {
      UsersDB.deleteUsers()
    })

    test('POST:/api/users. Should create two identical users with different ids', async () => {
      response = await request.post(baseUrl).send(user)
      expect(response.statusCode).toBe(HttpStatusCode.Created)
      expect(response.body).toMatchObject({ data: user })
      userId1 = ((response.body as HttpResponseSuccess).data as User).id

      response = await request.post(baseUrl).send(user)
      expect(response.statusCode).toBe(HttpStatusCode.Created)
      expect(response.body).toMatchObject({ data: user })
      userId2 = ((response.body as HttpResponseSuccess).data as User).id

      expect(userId1).not.toBe(userId2)
    })

    test('GET:/api/users. Should get list with two users', async () => {
      response = await request.get(baseUrl)
      expect(response.statusCode).toBe(HttpStatusCode.Ok)
      expect(response.body).toMatchObject({ data: [{ ...user, id: userId1 }, { ...user, id: userId2 }] })
    })

    test('PUT:/api/users/{userId}. Should update and return user 1', async () => {
      response = await request.put(`${baseUrl}/${userId1}`).send(updatedUser)
      expect(response.statusCode).toBe(HttpStatusCode.Ok)
      expect(response.body).toMatchObject({ data: { ...updatedUser, id: userId1 } })
    })

    test('DELETE:/api/users/{userId}. Should delete user 2 and return statusCode 204', async () => {
      response = await request.delete(`${baseUrl}/${userId2}`)
      expect(response.statusCode).toBe(HttpStatusCode.NoContent)
    })

    test('GET:/api/users. Should get list with one updated user 1', async () => {
      response = await request.get(baseUrl)
      expect(response.statusCode).toBe(HttpStatusCode.Ok)
      expect(response.body).toMatchObject({ data: [{ ...updatedUser, id: userId1 }] })
    })
  })
})
