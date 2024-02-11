import { RequiredUser } from '../types'

export const extractAllowedFields = (body: Record<string, unknown>): Record<string, unknown> => {
  if (typeof body === 'object' && body !== null) {
    const { username, age, hobbies } = body as Record<string, unknown>
    return { username, age, hobbies } as Record<string, unknown>
  }
  return {} as Record<string, unknown>
}

export const isValidBody = (body: Record<string, unknown> | RequiredUser): body is RequiredUser => {
  const { username, age, hobbies } = body
  return (
    !!username && typeof username === 'string' &&
    !!age && typeof age === 'number' && age > 0 &&
    !!hobbies && Array.isArray(hobbies) && hobbies.every(hobby => typeof hobby === 'string')
  )
}
