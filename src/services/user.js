
import { userRepository } from 'repositories'
import { comparePassword, createToken, createHash } from 'utils'

const _repository = userRepository()

export const userService = (/* repository */) => {
  // _repository = repository
  return {
    getCurrentUser,
    register,
    login
  }
}

const getCurrentUser = async (user) =>
  _getByEmail(user.email)

const register = async ({ email, lastName, name, gender, password, username }, image) => {
  const user = await _getByEmail(email)
  if (user) throw new Error('User already exists')

  const result = _repository.create({
    email,
    person: {
      lastName,
      name
    },
    username,
    gender,
    hash: createHash(password)
  }, ['user'])
  return (await result)
}

const login = async ({ email, password }) => {
  const user = await _getByEmail(email)
  if (!user) throw new Error('User not exists!!')

  const result = comparePassword(password, user.hash)
  if (!result) throw new Error('Email or Password not correct!!')

  return createToken(user)
}

const _getByEmail = async (email) =>
  _repository.getByEmail(email)
