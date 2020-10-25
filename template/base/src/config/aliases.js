import path from 'path'
import moduleAlias from 'module-alias'

let aliasesEnvs = {
  default: {
    '~': path.join(__dirname, '../../'),
    '@': path.join(__dirname, '../')
  },
  development: {
    // set your dev env aliases
  },
  production: {
    // set your pro env aliases
  }
}

for (let alias in aliasesEnvs.default) {
  moduleAlias.addAlias(alias, aliasesEnvs.default[alias])
}

if (
  process.env.NODE_ENV !== undefined &&
  aliasesEnvs[process.env.NODE_ENV] !== undefined
) {
  for (let alias in aliasesEnvs[process.env.NODE_ENV]) {
    moduleAlias.addAlias(alias, aliasesEnvs[process.env.NODE_ENV][alias])
  }
}

moduleAlias()
