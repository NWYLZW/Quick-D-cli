import QMongoose from 'quick-d/lib/plugin/QMongoose'
import { QModel } from 'quick-d/lib/common/Component'

@QMongoose.QSchema()
class User {
  @QMongoose.QProperty({ type: String, unique: true })
  name: string
  @QMongoose.QProperty({ type: String })
  nickName: string
  @QMongoose.QProperty({ type: String })
  passwordSHA256: string
}

@QModel()
export default class UserModel {
  addUser (name, nickName, password) {
    return new Promise((resolve, reject) => {
      const newUser = new (User.$QModel)({
        name, nickName,
        passwordSHA256: require('crypto')
          .createHash('sha256', 'sha256-quick-d')
          .update(password, 'utf8')
          .digest('hex')
      })
      newUser.save(err => {
        if (err) {
          reject(err)
          return
        }
        resolve(newUser)
      })
    })
  }
}
