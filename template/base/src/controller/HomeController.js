const { GetRequest } = require('quick-d/lib/common/Request')
const { Controller } = require('quick-d/lib/common/Controller')

@Controller('/home')
class HomeController {
  @GetRequest('/hello')
  async hello (ctx) {
    console.log(ctx)
    return `
      <h1>Hello world</h1>
    `
  }
}
