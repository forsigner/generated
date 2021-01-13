import { Command, flags } from '@oclif/command'
import { loadConfig } from './load-gconfig'
import { loadGeneratedrc } from './load-generatedrc'

export default class Generated extends Command {
  static description = 'Generate your code'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    plugin: flags.string({ char: 'p' })
  }

  async run() {
    try {
      const { flags } = this.parse(Generated)
      const cmdPluginName = flags.plugin  // run single plugin

      const { configDir, plugins = [], generatedDir } = loadGeneratedrc() // Generatedrc config
      const allPluginConfig = loadConfig(configDir) // plugin config

      const opt = {
        config: allPluginConfig || {},
        generatedDir,
      }

      /** run all plugins */
      for (const plugin of plugins) {

        if(cmdPluginName) {
          if (typeof plugin !== 'string') continue
          if (plugin !== cmdPluginName) continue
          require(plugin).default(opt)
          break
        } else {
          if (typeof plugin === 'string') {
            require(plugin).default(opt)
            continue
          }
          plugin(opt)
        }
      }

    } catch (error) {
      console.log(error)
    }
  }
}

export * from './typings'
