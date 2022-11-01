
import { connect, connection } from 'mongoose'
import { seedMongodb } from './seed'

const path = 'apollo-micro-postblog'

export const connectMongodb = () => {
  connect(`mongodb://localhost:27017/${path}`)
}

connection.on('open', async () => {
  console.log(`Mongodb connected on ${path}`)
  await seedMongodb()
})

connection.on('error', (error) => {
  console.log(error)
})
