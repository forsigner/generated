export interface GeneratedrcConfig {
  configDir?: string
  generatedDir?: string
  plugins?: any[]
}

export interface PluginOptions {
  config: any
  generatedDir?: string
}
