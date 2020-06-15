import { Command, flags } from '@oclif/command'
import { join } from 'path'
import { loadConfig } from './load-gconfig'
import { loadGeneratedrc } from './load-generatedrc'

export default class Generated extends Command {
  static description = 'Generate your code'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
  }

  async run() {
    try {
      const generatedrcConfig = loadGeneratedrc() // Generatedrc config
      const allPluginConfig = loadConfig() // plugin config
      const { plugins = [] } = generatedrcConfig

      /** run all plugins */
      for (const plugin of plugins) {
        const opt = {
          config: allPluginConfig || {},
          generatedDir: generatedrcConfig.generatedDir,
        }
        if (typeof plugin === 'string') {
          require(plugin).default(opt)
          continue
        }
        plugin(opt)
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export * from './typings'
