import axios from 'axios'
import { User, Post } from 'models'
import { genSaltSync, hashSync } from 'bcrypt'
import { join } from 'path'
import fs from 'fs'
import { Types } from 'mongoose'

export const seedMongodb = async () => {
  console.log('%c Seed Started', 'color: #bada55')

  let usersUpdated = false
  if (await User.count() < 2) {
    await seedUsers()
    usersUpdated = true
  }

  if (await Post.count() < 1) { await seedPosts() }
  if (usersUpdated) {
    await seedAllUsersSubscribers()
    await seedAllUsersSubscriptions()
  }

  console.log('%c Seed finished!!', 'color: #bada55')
}

const seedUsers = async (usersCount = 4) => {
  console.log('Users seed started!!')
  const USERS_IMAGE_PATH = join('public', 'images', 'users', 'seeds')
  const _getUserFromFakeApi = async () => {
    const result = await axios.get('https://jsonplaceholder.typicode.com/users/' + _random(10, 1))
    const user = result.data
    return user
  }
  const _generatePasswordHash = (password) => {
    const salt = genSaltSync(10)
    const hash = hashSync(password, salt)
    return hash
  }
  const _generateUsers = async (usersCount) => {
    while (usersCount !== await User.count()) {
      console.log('Searching user!!')

      const user = await _getUserFromFakeApi()
      if (!await User.findOne({ email: user.email })) {
        await User.create({
          email: user.email,
          gender: _random(2) ? 'female' : 'female',
          isVerified: true,
          person: {
            name: user.name,
            lastName: user.username,
            image: _getRandomImagesFromPath(USERS_IMAGE_PATH, 1)[0]
          },
          hash: _generatePasswordHash('12345')
        })
      }
    }
  }
  await _generateUsers(usersCount)
  console.log('Users seed finished!!')
}

const seedPosts = async (postsCount = 30, startPosition = 20) => {
  console.log('Posts seed started!!')
  const POSTS_IMAGE_PATH = join('public', 'images', 'seeds')
  const users = await User.find()
  const result = await axios.get('https://jsonplaceholder.typicode.com/posts')
  const end = _random(postsCount, startPosition)
  for (let index = 0; index < end; index++) {
    const images = _getRandomImagesFromPath(POSTS_IMAGE_PATH).map((path) => ({
      uri: path,
      type: 'image'
    }))

    const generateRandomPostUsers = (users, registeredUserCount) => {
      const randomUserOfPost = _random(registeredUserCount)
      const randomLikedUsersCount = _random(registeredUserCount - 1)
      const user = users[randomUserOfPost]
      let likedUsers = []
      while (likedUsers.length !== randomLikedUsersCount) {
        const randomLikedUser = _random(registeredUserCount - 1)
        if (randomUserOfPost !== randomLikedUser && !likedUsers.includes(users[randomLikedUser])) { likedUsers = [...likedUsers, users[randomLikedUser]] }
      }
      return {
        userOfPost: new Types.ObjectId(user),
        likedUsers: likedUsers.map(value => new Types.ObjectId(value))
      }
    }
    const { userOfPost, likedUsers } = generateRandomPostUsers(users, users.length)

    const item = result.data[index]
    await Post.create({
      date: Date.now(),
      description: item.body,
      title: item.title,
      medias: images,
      user: userOfPost,
      likes: likedUsers
    })
  }
  console.log('Posts seed finished!!')
}

const seedAllUsersSubscribers = async () => {
  const users = await User.find()
  users.forEach(async (user) => {
    let subscribers = []

    const randomSubscribersCount = _random(users.length - 1)
    while (randomSubscribersCount !== subscribers.length - 1) {
      const randomSubscriberNumber = _random(users.length - 1)
      if (users[randomSubscriberNumber].id !== user.id && !subscribers.includes(new Types.ObjectId(users[randomSubscriberNumber].id))) { subscribers = [...subscribers, new Types.ObjectId(users[randomSubscriberNumber].id)] }
    }

    await User.findByIdAndUpdate(user.id, { subscribers: [...subscribers] })
  })
  console.log('Users Subscribers Updated!')
}
const seedAllUsersSubscriptions = async () => {
  const users = await User.find()
  users.forEach(async (user) => {
    let subscriptions = []

    const randomSubscriptionsCount = _random(users.length - 1)
    while (randomSubscriptionsCount !== subscriptions.length - 1) {
      const randomSubscriptionNumber = _random(users.length - 1)
      if (users[randomSubscriptionNumber].id !== user.id && !subscriptions.includes(new Types.ObjectId(users[randomSubscriptionNumber].id))) {
        subscriptions = [...subscriptions, new Types.ObjectId(users[randomSubscriptionNumber].id)]
      }
    }

    await User.findByIdAndUpdate(user.id, { subscriptions: [...subscriptions] })
  })
  console.log('Users Subscriptions Updated!')
}

// for (let index = 0; index < 20; index++) {
//     console.log({ [index + 1]: `https://picsum.photos/seed/${v4()}/200/200` })
// }

const _getRandomImagesFromPath = (path, count) => {
  // eslint-disable-next-line no-undef
  const files = fs.readdirSync(join(__basedir, path))
  const randomCountNumber = count || Math.floor(Math.random() * files.length)
  let images = []

  while (images.length - 1 !== randomCountNumber) {
    const randomImageNumber = _random(files.length)
    if (!images.includes(files[randomImageNumber])) { images = [...images, join(path, files[randomImageNumber])] }
  }
  return images
}

const _random = (end = 5, start = 0) => {
  return Math.floor(Math.random() * (end - start)) + start
}
