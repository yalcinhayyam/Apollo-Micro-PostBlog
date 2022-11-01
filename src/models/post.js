import { model, Schema } from 'mongoose'

const MediaSchema = new Schema({
  uri: String,
  type: {
    type: String,
    enum: ['image', 'video']
  }

})
const PostLikedNotificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  isSeen: { type: Boolean, default: false }
})
const PostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  medias: [{ type: MediaSchema, default: [] }],
  title: String,
  description: String,
  date: String,
  likes: [{ type: Schema.Types.ObjectId, ref: 'user', default: [] }],
  notifications: [{ type: PostLikedNotificationSchema, default: [] }],
  isActive: { type: Boolean, default: true }
})

export const Post = model('post', PostSchema)
