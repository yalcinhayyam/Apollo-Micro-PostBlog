import { instances } from 'config'
import jwt from 'jsonwebtoken'


let _userService
export const webSocketAuth = () => {
  _userService = instances.userService
  return {
    webSocketAuth: _webSocketAuth
  }
}

const _webSocketAuth = async (ctx, roles) => {
  const { connectionParams } = ctx
  const authorization = connectionParams?.Authorization || connectionParams?.['x-token'] || connectionParams?.authToken
  // let refreshToken = connectionParams?.['x-refresh-token']

  if (!authorization) throw new Error('Auth token not found')

  const token = authorization.split(' ')?.[1]
  if (!authorization) throw new Error('Token not correct')

  const result = jwt.verify(
    token,
    process.env.JWT_SECRET
  )
  if (!result) throw new Error('User not auth')

  const { email, roles: payloadRoles } = result

  const authority = !roles ? true : roles.map(value => value.toLowerCase()).some((value) => payloadRoles.includes(value.toLowerCase()))
  if (!authority) throw new Error('Permission insufficient!')
  return { user: await _userService.getByEmail(email) }
}
