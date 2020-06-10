export interface GeneratedrcConfig {
  configDir?: string
  generatedDir?: string
  plugins?: string[]
}

export interface PluginOptions {
  config: any
  generatedDir?: string
}
