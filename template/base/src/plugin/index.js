import { registerDBServers } from 'quick-d/lib'

import config from '@/config/index'

// if (selDataBaseSystem)
import getDataBaseServers from '@/plugin/dataBaseServer'
// endif

const registerPlugins = async () => {
  // if (selDataBaseSystem)
  registerDBServers(
    await getDataBaseServers(config)
  )
  console.log('global[\'$Quick-D\'][\'dataBaseServers\']: ', global['$Quick-D']['dataBaseServers'])
  // endif
}

export {
  registerPlugins
}
