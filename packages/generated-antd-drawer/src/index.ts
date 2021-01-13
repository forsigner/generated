import { join, resolve, isAbsolute } from 'path'
import { generateDrawerContainer } from './generate-drawer-container'
import { generateDrawerService } from './generate-drawer-service'
import { PluginOptions } from 'generated'
import { Config } from './typings'

export default (options = {} as PluginOptions) => {
  const antdDrawerConfig: Config = options.config.antdDrawer || {}
  const cwd = process.cwd()
  let { generatedDir = join(cwd, 'src', 'generated') } = options
  let { drawersDir = join(cwd, 'src', 'drawers') } = antdDrawerConfig || {}
  const { moduleSpecifier = '@peajs/drawer' } = antdDrawerConfig

  if (!isAbsolute(generatedDir)) {
    generatedDir = resolve(cwd, generatedDir)
  }

  generateDrawerContainer(generatedDir, drawersDir, moduleSpecifier)
  generateDrawerService(generatedDir, drawersDir, moduleSpecifier)
}

export * from './typings'
