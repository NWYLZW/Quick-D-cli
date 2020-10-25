import devConfig from './dev'
import proConfig from './pro'

import './aliases'

const config = {
  production: proConfig,
  development: devConfig
}

export default {
  ...config[process.env.NODE_ENV]
}
