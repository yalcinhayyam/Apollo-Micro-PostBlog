import { Types } from 'mongoose'
import { Post } from 'models'

export const postRepository = () => ({
  getById,
  getByUserId,
  getAll,
  create,
  update,
  count

})

const getByUserId = (id) => _query({ user: id })

const getById = (id) => _query({ id }, true)

const getAll = () => _query()

const create = async ({ title, description, medias, date }, user) => _populateUser(await Post.create({
  title,
  description,
  medias,
  date,
  user: Types.ObjectId(user.id)
}))

const update = async (condition, values) =>
  _populateAllFields(Post.findByIdAndUpdate(condition, values, { new: true }))

const count = () => Post.count()

const _populateAllFields = (post) => _populateNotifications(_populateLikes(_populateUser(post)))

const _populateUser = (post) => post.populate('user')
const _populateLikes = (post) => post.populate('likes')
const _populateNotifications = (post) => post.populate({
  path: 'notifications',
  populate: {
    path: 'user'
  }
})

const _query = (condition, isSingle = false) => condition
  ? isSingle ? _populateAllFields(Post.findOne(condition)) : _populateAllFields(Post.find(condition))
  : isSingle ? _populateAllFields(Post.findOne()) : _populateAllFields(Post.find())
