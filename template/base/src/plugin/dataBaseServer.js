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
