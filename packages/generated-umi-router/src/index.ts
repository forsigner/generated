import { join, resolve, isAbsolute } from 'path'
import { generateRouterlService } from './generate-router-service'
import { PluginOptions } from 'generated'
import { Config } from './typings'
import { loadRoutesConfig } from './load-routes-config'

export default (options = {} as PluginOptions) => {
  const config: Config = options.config.reactNativeRouter || {}
  const cwd = process.cwd()
  let { generatedDir = join(cwd, 'src', 'generated') } = options
  let { umiConfigPath = join(cwd, '.umirc.ts') } = config || {}

  const routesConfig = loadRoutesConfig(umiConfigPath)

  if (!isAbsolute(generatedDir)) generatedDir = resolve(cwd, generatedDir)

  generateRouterlService(generatedDir, routesConfig)
}

export * from './typings'
