const Koa = require('koa')
const { registerApp } = require('quick-d')

const app = new Koa()

registerApp(app)

const controllersFileNames = require('fs').readdirSync(__dirname + '/controller')
for (let controllersNameIndex in controllersFileNames) {
    const controllersName = controllersFileNames[controllersNameIndex]

    if (/\.js$/.test(controllersName)) {
        require(`./controller/${controllersName}`)
    }
}

app.listen(12333, '127.0.0.1', _ => {
    console.log('Server is running')
})
