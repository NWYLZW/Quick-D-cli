// if (selDataBaseSystem)
import { registerDBServers } from 'quick-d/lib'
// endif
import config from '@/config/index'

// if (selDataBaseSystem)
import getDataBaseServers from '@/plugin/dataBaseServer'
// endif

const registerPlugins = async () => {
  // if (selDataBaseSystem)
  registerDBServers(
    await getDataBaseServers(config)
  )
  // endif
}

export {
  registerPlugins
}
