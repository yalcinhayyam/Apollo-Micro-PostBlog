// import { paginate } from 'utils'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { createServer } from 'http'
import { PubSub } from 'graphql-subscriptions'
import { applyMiddleware } from 'graphql-middleware'

import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
  UserInputError
} from 'apollo-server-core'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { auth, webSocketAuth, validatePostCreateInput, validateRegisterInput } from 'middlewares'

import typeDefs from './typeDefs'
import resolvers from './resolvers'
import path from 'path'
import { existsSync, mkdirSync } from 'fs'
import { connect } from 'config'
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js'

global.__basedir = __dirname

const app = express()
existsSync(path.join(__dirname, 'public')) || mkdirSync(path.join(__dirname, 'public'))
existsSync(path.join(__dirname, 'public', 'images')) || mkdirSync(path.join(__dirname, 'public', 'images'))
existsSync(path.join(__dirname, 'public', 'videos')) || mkdirSync(path.join(__dirname, 'public', 'videos'))
existsSync(path.join(__dirname, 'public', 'images', 'users')) || mkdirSync(path.join(__dirname, 'public', 'images', 'users'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(graphqlUploadExpress())
const httpServer = createServer(app)

require('dotenv').config()
connect()

const pubsub = new PubSub()

const validateMiddlevare = {
  Mutation: {
    createPost: async (resolve, parent, args, ctx, info) => {
      const result = validatePostCreateInput(args.input)
      if (result.error) { throw new UserInputError(result.error) }
      return await resolve(parent, args, ctx, info)
    },
    register: async (resolve, parent, args, ctx, info) => {
      const result = validateRegisterInput(args.input)
      if (result.error) { throw new UserInputError(result.error) }
      return await resolve(parent, args, ctx, info)
    }

  }
}

const authMiddleware = {
  Mutation: {
    createPost: async (resolve, parent, args, ctx, info) => {
      return await resolve(parent, args, { ...ctx, ...await auth(ctx, ['user']) }, info)
    },
    like: async (resolve, parent, args, ctx, info) => {
      return await resolve(parent, args, { ...ctx, ...await auth(ctx, ['user']) }, info)
    }
  },
  Query: {
    user: async (resolve, parent, args, ctx, info) => {
      return await resolve(parent, args, { ...ctx, ...await auth(ctx, ['user']) }, info)
    }
  }
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

const schemaWithMiddleware = applyMiddleware(schema, authMiddleware, validateMiddlevare)

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/subscriptions'
})

const serverCleanup = useServer({
  onConnect: async (ctx) => ({ ...ctx, ...await webSocketAuth(ctx) }),
  context: ({ req, res }) => ({ req, res, pubsub }),
  schema
}, wsServer)

const server = new ApolloServer({
  schema: schemaWithMiddleware,
  csrfPrevention: true,
  cache: 'bounded',
  context: ({ req, res }) => ({ req, res, pubsub }),
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart () {
        return {
          async drainServer () {
            await serverCleanup.dispose()
          }
        }
      }
    },
    ApolloServerPluginLandingPageLocalDefault({ embed: true })
  ]
})

const bootstrap = async () => {
  await server.start()
  server.applyMiddleware({ app })

  const PORT = 4000

  httpServer.listen(PORT, () => {
    console.log(
      `Server is now running on http://localhost:${PORT}${server.graphqlPath}`
    )
  })
}

bootstrap()
