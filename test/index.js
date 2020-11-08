const tool = require('../tool')

tool.render(
    require('path').join(__dirname, './template.ejs'), {
        selMongoDB: true,
        selMysql: false
    }, 'utf-8'
).then(str => {
    console.log(str)
})
