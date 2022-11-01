import { userRepository, postRepository } from 'repositories'
import { postService, userService } from 'services'

export const injector = {
  inject: () => ({
    postService: postService(postRepository, userService),
    userService: userService(userRepository)
  })
}

export const instances = injector.inject()
