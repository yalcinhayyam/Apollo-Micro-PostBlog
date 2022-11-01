import { model, Schema } from 'mongoose'

const MessagePostedNotificationSchema = new Schema({
  message: { type: Schema.Types.ObjectId, ref: 'user' },
  isSeen: { type: Boolean, default: false }
})

const MessageSchema = new Schema({
  content: String,
  date: String,
  user: { type: Schema.Types.ObjectId, ref: 'user' }
})

const ChatSchema = new Schema({
  title: String,
  description: String,
  users: [{ type: Schema.Types.ObjectId, ref: 'user', default: [] }],
  messages: [{ type: MessageSchema, default: [] }],
  notifications: [{ type: MessagePostedNotificationSchema, default: [] }],
  isActive: { type: Boolean, default: true }
})

export const Post = model('chat', ChatSchema)
