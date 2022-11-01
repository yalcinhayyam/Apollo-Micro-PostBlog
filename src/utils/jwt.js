
import jwt from 'jsonwebtoken'

export const createToken = (user) => {
  const { id, email, roles } = user
  const token = jwt.sign({
    email,
    id,
    roles
  },
  process.env.JWT_SECRET
  )
  const payload = {
    ...user.toObject(), token
  }
  return payload
}
