
import { postRepository } from 'repositories'
import { paginate, subFieldPaginate } from 'utils'

// let _userService
const _repository = postRepository()
// let _userService = postRepository()

export const postService = (/* repository, userService */) => {
  // _repository = repository
  // _userService = userService
  return {
    create,
    getAll,
    getPostLikes,
    getPostLikeCount,
    getByUserId,
    like
  }
}

const create = async ({ title, description, medias = [] }, user) => {
  const result = await _repository.create({
    title,
    description,
    medias,
    date: Date.now()
  }, user)
  return result
}
const getByUserId = async (id) => _repository.getByUserId(id)

const getAll = async (first, after) => paginate(
  _repository.getAll(),
  _repository.count(),
  first,
  after
)
const getPostLikes = async (postId, first, after) => subFieldPaginate(
  (await _repository.getById(postId)).likes,
  first,
  after
)

const getPostLikeCount = async (postId) => (await getPostLikes(postId)).length

const like = async (id, user) => {
  const result = await _updatePostLikes(user, await _repository.getById(id))
  const post = await _repository.update(id, { likes: result })
  return post
}

const _updatePostLikes = async (user, { likes }) => {
  return likes.find(like => like.id === user.id)
    ? likes.filter(like => like.id !== user.id)
    : [...likes, user]
}
