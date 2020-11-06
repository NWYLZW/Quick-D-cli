import { GetRequest } from 'quick-d/lib/common/Request'
import { Controller } from 'quick-d/lib/common/Controller'
import { Query } from 'quick-d/lib/common/BodyParam'
// if (selMongoDB)
import { AutoWired } from 'quick-d/lib/common/Component'

import UserModel from '@/model/UserModel'
// endif

@Controller('/home')
class HomeController {
  // if (selMongoDB)
  @AutoWired()
  static userModel: UserModel
  // endif

  @GetRequest('/hello')
  async hello (ctx) {
    console.log(ctx)
    return `
      <h1>Hello world</h1>
    `
  }
  @GetRequest('/register')
  async registerNewUser (
    @Query('name', true) name,
    @Query('nickName', true) nickName,
    @Query('password', true) password
  ) {
    // if (selMongoDB)
    console.log(await this.userModel.addUser(
      name, nickName, password
    ))
    // endif
    return {
      name, nickName, password
    }
  }
}
