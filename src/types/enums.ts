export enum ErrorMessage {
  InternalServerError = 'Unexpected server side error.',
  MethodNotAllowed = 'Method not allowed for requested resource.',
  ResourceNotExist = 'Requested resource is not found.',
  UserNotExist = 'Requested user does not exist.',
  InvalidBody = 'Request body does not contain required fields (username: string, age: number, hobbies: string[])',
  InvalidUserId = 'Requested user id is not valid',
}

export enum HttpStatusCode {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  NotFound = 404,
  MethodNotAllowed = 405,
  InternalServerError = 500,
}

export enum HttpMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}

export enum WorkerActions {
  GetUsers = 'GET_USERS',
  GetUser = 'GET_USER',
  PostUser = 'POST_USER',
  PutUser = 'PUT_USER',
  DeleteUser = 'DELETE_USER',
}
