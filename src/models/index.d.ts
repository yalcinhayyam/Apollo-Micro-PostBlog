import { Model } from "mongoose";


interface IUser {
    email: string
    posts: string[]
    person: IPerson
    hash: string
    gender: Gender
    roles?: Roles[]
    notifications: IPostNotification[]
    subscribers: string[]
    subscriptions: string[]
    isVerified: boolean
}

interface IMedia {
    uri: string
    type: MediaType,
}

interface ILikeNotification {
    user: string
    isSeen: boolean
}

interface IPost {
    user: string
    medias: IMedia[]
    title: string
    description: string
    date: string
    likes: string[]
    notifications: ILikeNotification[]
    isActive: boolean
}

interface IPostNotification {
    post: string
    isSeen: boolean
}

interface IPerson {
    name: string
    lastName: string
    image?: string
}
declare type MediaType = 'image' | 'video'
declare type Gender = 'male' | 'female'
declare type Roles = 'user' | 'admin'

declare const User: Model<IUser>
declare const Post: Model<IPost>




