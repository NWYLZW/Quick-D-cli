export default {
  server: {
    host: '127.0.0.1',
    port: 12333
  },
  dataBaseServers: {
    'mongodb-server-01': {
      type: 'mongodb',
      host: '127.0.0.1',
      port: 27017,
      dbName: 'dev-server-1'
    }
  }
}
