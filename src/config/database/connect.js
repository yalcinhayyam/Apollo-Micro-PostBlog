import { connectMongodb } from 'database'

export const connect = () => {
  connectMongodb()
}
