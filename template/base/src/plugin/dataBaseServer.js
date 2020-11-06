// if (selMongoDB)
const getMongoClient = dataBaseServer => {
  return new Promise((resolve, reject) => {
    const url =
      `${dataBaseServer.type}://${dataBaseServer.host}:${dataBaseServer.port}/${dataBaseServer.dbName}`

    require('mongodb').connect(url, { useUnifiedTopology: true }, (err, db) => {
      if (err) {
        reject(err); return
      }
      resolve(db)
    })
  })
}

const getMongooseClient = dataBaseServer => {
  return new Promise((resolve, reject) => {
    const url = 'mongodb://' +
      (dataBaseServer.user     === undefined? '': dataBaseServer.user) +
      (dataBaseServer.password === undefined? '':':' + dataBaseServer.password + '@') +
      (dataBaseServer.host ?? 'localhost') +
      (dataBaseServer.port     === undefined? '':':' + dataBaseServer.port) +
      (dataBaseServer.dbName   === undefined? '':'/' + dataBaseServer.dbName)

    const mongoose = new (require('mongoose').Mongoose)()
    // Remove '(node:9716)DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead' warning
    mongoose.set('useCreateIndex', true)
    try {
      resolve(
        mongoose.connect(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          ...dataBaseServer.option
        })
      )
    } catch (e) {
      reject(e)
    }
  })
}
// endif
export default async (config) => {
  const
    dbClients = {},
    dataBaseServers = config?.dataBaseServers ?? {}

  for (const dataBaseServerName in dataBaseServers) {
    const dataBaseServer = dataBaseServers[dataBaseServerName]

    switch (dataBaseServer.type) {
      // if (selMongoDB)
      case 'mongodb':
        dbClients[dataBaseServerName] = ({
          type: 'mongodb',
          db: await getMongoClient(dataBaseServer)
        })
        break
      case 'mongoose':
        dbClients[dataBaseServerName] = {
          type: 'mongoose',
          db: await getMongooseClient(dataBaseServer)
        }
        break
      // endif
      // if (selMysql)
      case 'mysql':
        console.warn('Does not support mysql database temporarily')
        break
      // endif
      default:
        console.warn('This database type is not currently supported')
        break
    }
  }
  return dbClients
}
