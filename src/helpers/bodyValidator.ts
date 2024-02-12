import { RequiredUser } from '../types'

export const extractValidUserOrFalse = (body: Record<string, unknown>): RequiredUser | false => {
  if (typeof body === 'object' && body !== null) {
    const { username, age, hobbies } = body as Record<string, unknown>
    if (
      !!username && typeof username === 'string' &&
      !!age && typeof age === 'number' && age > 0 &&
      !!hobbies && Array.isArray(hobbies) && hobbies.every(hobby => typeof hobby === 'string')
    ) {
      return { username, age, hobbies } as RequiredUser
    }
  }
  return false
}
