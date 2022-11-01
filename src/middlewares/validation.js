import Joi from 'joi'

export const validateRegisterInput = (user) => {
  return _registerInputSchema.validate(user)
}

export const validatePostCreateInput = (post) => {
  return _postCreateInputSchema.validate(post)
}

const _postCreateInputSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(30)
    .required(),
  description: Joi.string()
    .min(1)
    .max(300)
    .required()
})

const _registerInputSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .required(),
  name: Joi.string()
    .min(3)
    .max(30)
    .required(),
  lastName: Joi.string()
    .min(3)
    .max(30)
    .required(),
  gender: Joi.string().valid('female', 'male'),
  email: Joi.string().email(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
})
