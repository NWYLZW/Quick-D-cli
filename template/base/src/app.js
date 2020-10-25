import path from 'path'
import Koa from 'koa'
import { registerApp } from 'quick-d'
import config from './config'

const app = new Koa()

registerApp(app)

const controllersFileNames = require('fs').readdirSync(
  path.join(__dirname, '/controller')
)

for (let controllersNameIndex in controllersFileNames) {
  const controllersName = controllersFileNames[controllersNameIndex]

  if (/\.js$/.test(controllersName)) {
    // @ is project root folder's src folder
    // you can customize alias in src/config/aliases.js
    require(`@/controller/${controllersName}`)
  }
}

app.listen(config.server.port, config.server.host, _ => {
    console.log(
      `Server is running in http://${config.server.host}:${config.server.port}`
    )
})
