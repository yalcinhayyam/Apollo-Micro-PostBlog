import { gql } from 'apollo-server'

const typeDefs = gql`

type Query {
    hello: String!
    me: User!
    post(id:ID!): Post!
    posts(first: Int!,after: String): PostConnection!
    # chat
    # chats
  }

type Mutation {
    register (input:CreateUserInput!,image: Upload): CreateUserPayload!
    login(input: LoginUserInput!): LoginUserPayload! 
    createPost(input: CreatePostInput!, medias: [Upload!]): CreatePostPayload! 
    like(id:ID!): Post!
    # forgotPassword
    # verify
    # showPostCreatedNotification
    # showPostLikedNotification
    # showmessageCreatedNotification
    # sendMessage
    # demoSub(id:ID!) : Notify!
  }

  type Post {
    user: User!
    id:ID!
    title:String!
    description:String!
    date: String!
    likes(first:Int!,after: String): UserConnection!
    notifications: [PostLikeNotification!]
    medias: [Media!]
  }

  type User {
    id: ID!
    image: String
    username: String!
    email: String!
    person: Person!
    gender: Gender! 
    posts(first:Int!,after: String): PostConnection!
    notifications: [PostCreatedNotification!] 
    subscribers: [User!]
    subscriptions: [User!]
  }



  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  enum Gender {
    female,
    male
  }
  enum MediaType {
    image,
    video
  }

  type PostConnection {
    nodes: [Post!]
    edges: [PostEdge!]
    pageInfo: PageInfo!
  }
  type PostEdge {
    cursor: String!
    node: Post!
  }

  type UserConnection {
    nodes: [User!]
    edges: [UserEdge!]
    pageInfo: PageInfo!
  }

  type UserEdge {
    cursor: String!
    node: User!
  }

  type Person {
    name: String!
    lastName: String!
    image: String
  }


  type PageInfo {
    startCursor: String
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    endCursor: String
  }

  type PostCreatedNotification {
    post: Post!
    isSeen: Boolean!
  }
  type PostLikeNotification {
    user: User!
    isSeen: Boolean!
  }



  type Media {
    uri: String!
    type: MediaType!
  }






  input CreateUserInput {
    email: String!
    name: String!
    username: String!
    lastName: String!
    gender: Gender!
    password: String! 
  }

  type CreateUserPayload {
    email: String!
    person: Person!
    username: String!
    gender: Gender!
    iamge: String
  }
  
  input LoginUserInput {
    username: String!
    password: String! 
  }

  type LoginUserPayload {
    email:String!
    person: Person!
    username: String!
    gender: Gender!
    token: String!
  }

  input CreatePostInput {
    title:String!
    description:String!
  }

  type CreatePostPayload {
    user: User!
    id:ID!
    title:String!
    description:String!
    date: String!
    medias: [Media!]
  }


  type Notify {
    value:String!
  }

  type Subscription {
    postCreated: Post!   
    like: Post!
    notify:Notify!
  }
`

export default typeDefs
