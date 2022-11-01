import jwt from 'jsonwebtoken'
import { getByEmail } from 'services'

export const auth = async (ctx, roles) => {
  const { req, res } = ctx
  // eslint-disable-next-line no-unused-vars
  const { set } = res
  const { headers } = req

  const authorization = headers?.authorization || headers?.Authorization || headers['x-token']
  // let refreshToken = headers?.authorization || headers?.Authorization || headers['x-refresh-token']
  if (!authorization) throw new Error('Auth token not found')

  const token = authorization.split(' ')?.[1]
  if (!authorization) throw new Error('Token not correct')

  const result = jwt.verify(
    token,
    process.env.JWT_SECRET
  )
  if (!result) throw new Error('User not auth')

  const { email, roles: payloadRoles } = result
  // let authority = roles.map(value => value.toLowerCase()).every((value) => payloadRoles.includes(value))
  const authority = !roles ? true : roles.map(value => value.toLowerCase()).some((value) => payloadRoles.includes(value))

  if (!authority) throw new Error('Permission insufficient!')
  return { user: await getByEmail(email) }
}
