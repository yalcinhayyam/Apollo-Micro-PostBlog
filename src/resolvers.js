// import { instances } from 'config'
import { withFilter } from 'graphql-subscriptions'
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js'
import { postService, userService } from 'services'

const _postService = postService()
const _userService = userService()

const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    hello: () => 'Hello World!!',
    posts: async (_, { first, after }) =>
      await _postService.getAll(first, after),
    me: async (_, __, context, info) =>
      await _userService.getCurrentUser(context.user),
    post: async (_, { id }, __, ___) => await _postService.getById(id)
  },
  Mutation: {
    register: async (_, { input, image }, ctx, info) =>
      await _userService.register(input, image),
    like: async (_, { id }, ctx, info) => {
      const result = await _postService.like(id, ctx)

      ctx.pubsub.publish('POST_LIKED', { like: result })
      return result
    },
    login: async (_, { input }, ctx, info) => await _userService.login(input),
    createPost: async (_, { input, medias }, ctx, info) => {
      const result = await _postService.create(input, medias, ctx.user)

      ctx.pubsub.publish('POST_CREATED', { postCreated: result })
      return result
    },
    demoSubs: async (_, { id }, ctx, info) => {
      const data = { value: Date.now() + ' ' + id }
      ctx.pubsub.publish('DEMO_SUBSCRIPTION', { notify: data })
      return data
    }

  },
  Subscription: {
    notify: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(['DEMO_SUBSCRIPTION']),
        (payload, variables) => {
          console.log(payload, variables)
          return true
        }
      )
    },
    like: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(['POST_LIKED']),
        (payload, variables) => {
          return true
        }
      )
    },
    postCreated: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(['POST_CREATED']),
        (payload, variables) => {
          return true
        }
      )
    }
  },
  User: {
    posts: async ({ id }, { first, after }, ___, ____) =>
      await _postService.getByUserId(id, first, after)
  },
  Post: {
    likes: async ({ id }, { first, after }, context, info) =>
      await _postService.getPostLikes(id, first, after)
  }
}

export default () => {
  // _userService = instances.userService
  // _postService = instances.postService
  return resolvers
}
