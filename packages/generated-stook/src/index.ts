import { join, resolve, isAbsolute } from 'path'
import { existsSync } from 'fs'
import { PluginOptions } from 'generated'
import { generateStores } from './generate-stores'
import { Config } from './typings'

export default (options = {} as PluginOptions) => {
  const stookConfig: Config = options.config.stook || {}
  const cwd = process.cwd()
  let { generatedDir = join(cwd, 'src', 'generated') } = options
  let { storesDir = join(cwd, 'src', 'stores') } = stookConfig || {}
  const { moduleSpecifier = 'stook' } = stookConfig

  if (!isAbsolute(generatedDir)) {
    generatedDir = resolve(cwd, generatedDir)
  }

  if (!isAbsolute(generatedDir)) {
    generatedDir = resolve(cwd, generatedDir)
  }

  if (existsSync(storesDir)) {
    generateStores(generatedDir, storesDir, moduleSpecifier)
  }
}

export * from './typings'
