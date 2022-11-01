import { model, Schema } from 'mongoose'

const PersonSchema = new Schema({
  name: String,
  lastName: String,
  image: String
})

const PostCreatedNotificationSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: 'post' },
  isSeen: { type: Boolean, default: false }
})

const UserSchema = new Schema({
  email: String,
  username: String,
  // posts: [{ type: Schema.Types.ObjectId, ref: 'post', default: [] }],
  person: PersonSchema,
  hash: String,
  gender: {
    type: String,
    enum: ['male', 'female']
  },
  roles: [{
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }],
  notifications: [{ type: PostCreatedNotificationSchema, default: [] }],
  subscribers: [{ type: Schema.Types.ObjectId, ref: 'user', default: [] }],
  subscriptions: [{ type: Schema.Types.ObjectId, ref: 'user', default: [] }],
  isVerified: { type: Boolean, default: false }
})

export const User = model('user', UserSchema)
