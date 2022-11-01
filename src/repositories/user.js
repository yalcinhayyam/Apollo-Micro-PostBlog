import { User } from 'models'

export const userRepository = () => ({
  getByEmail,
  getById,
  getAll,
  create,
  update,
  count
})

const getByEmail = (email) => _query({ email }, true)
const getById = (id) => _query({ id }, true)

const getAll = () => _query()

const create = async ({ email, lastName, name, gender, hash }, roles, image) => {
  const user = new User({
    email,
    person: { lastName, name },
    gender,
    hash
  })
  if (roles) { user.roles = roles }
  if (image) { user.person.image = image }
  return await user.save()
}

const update = async (condition, values) =>
  _populateAllFields(User.findByIdAndUpdate(condition, values, { new: true }))

const count = () => User.count()

const _populateAllFields = (user) => _populateNotifications(_populateSubscriptions(_populateSubscribers(user)))

const _populateSubscribers = (user) => user.populate('subscribers')
const _populateSubscriptions = (user) => user.populate('subscriptions')
const _populateNotifications = (user) => user.populate({
  path: 'notifications',
  populate: {
    path: 'post'
  }
})

const _query = (condition, isSingle = false) => condition
  ? isSingle ? _populateAllFields(User.findOne(condition)) : _populateAllFields(User.find(condition))
  : isSingle ? _populateAllFields(User.findOne()) : _populateAllFields(User.find())
