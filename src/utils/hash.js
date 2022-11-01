import { genSaltSync, hashSync, compare } from 'bcrypt'

export const comparePassword = (password, hash) => compare(password, hash)
export const createHash = (password) => hashSync(password, genSaltSync(10))
