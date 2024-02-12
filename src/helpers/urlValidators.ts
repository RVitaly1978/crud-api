const baseUrlRegex = /^\/api\/users\/?$/
const uuidUrlRegex = /^\/api\/users\/(?<id>\w{8}-\w{4}-\w{4}-\w{4}-\w{12})$/
const invalidIdUrlRegex = /^\/api\/users\/[^\/]+$/
const uuidRegex = /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/

export const baseUrl = '/api/users'

export const matchBaseUrl = (url = ''): boolean => baseUrlRegex.test(url)

export const matchValidUserIdUrl = (url = ''): boolean => uuidUrlRegex.test(url)

export const matchInvalidUserIdUrl = (url = ''): boolean =>
  invalidIdUrlRegex.test(url)

export const matchUuid = (uuid = ''): boolean => uuidRegex.test(uuid)

export const getUserIdFromUrl = (url = ''): string => {
  const { groups } = url.match(uuidUrlRegex) as RegExpMatchArray
  return groups?.id || ''
}
